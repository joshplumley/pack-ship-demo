const { Router } = require("express");
const router = Router();
const Shipment = require("./model");
const PackingSlip = require("../packingSlip/model");
const Customer = require("../customer/model");
const handler = require("../handler");

module.exports = router;

router.get("/", getAll);
router.put("/", createOne);

router.get('/search', searchShipments);

router.get("/queue", getQueue);

router.get("/:sid", getOne);
router.patch("/:sid", editOne);
router.delete("/:sid", deleteOne);

/**
 * Compute a search of shipment documents that match either a given order or a given part.
 * Further, results should be paginated according to the parameters
 * - resultsPerPage
 * - pageNumber
 * 
 * TODO: this query should really be using a more sophisticated aggregation pipeline,
 *    but for testing, we're just pulling all docs and having the server truncate.
 */
async function searchShipments(req, res) {
  handler(
    async () => {
      let { sortBy, sortOrder, matchOrder, matchPart, resultsPerPage, pageNumber } = req.body;

      if (!matchOrder && !matchPart) return [{ status: 400, data: 'At least one of matchOrder or matchPart must be non-empty.' }];
      if (isNaN(+resultsPerPage) || resultsPerPage <= 0) return [{ status: 400, data: 'resultsPerPage must be a positive integer.' }];

      if (sortBy !== 'CUSTOMER' || sortBy !== 'DATE') sortBy = 'DATE';
      if (sortOrder !== -1 || sortOrder !== 1) sortOrder = 1;
      if (isNaN(+pageNumber) || pageNumber < 1) pageNumber = 1;

      const allShipments = await Shipment.find()
        .populate('customer')
        .populate({
          path: 'manifest',
          populate: 'items.item'
        })
        .lean()
        .exec();

      const matchShipments = allShipments.filter(x =>
        (x.manifest).some(y =>
          (matchOrder && new RegExp(matchOrder).test(y.orderNumber)) ||
          (matchPart && (y.items).some(z =>
            new RegExp(matchPart).test(z.item.partNumber) ||
            new RegExp(matchPart).test(z.item.partDescription)
          ))
        )
      );

      const sortFunc = (a,b) => {
        let testVal;
        if (sortBy === 'CUSTOMER') testVal = a.customer.customerTag - b.customer.customerTag;
        else testVal = a.dateCreated.getTime() - b.dateCreated.getTime();

        if (testVal * sortOrder < 1) return -1;
        else return 1;
      };

      matchShipments.sort( sortFunc );

      const start = ( resultsPerPage*(pageNumber - 1) );
      const end = resultsPerPage * pageNumber;

      const shipments = matchShipments.slice(start, end);

      return [null, { data: shipments }];
    },
    'searching shipments',
    res
  )
}

/**
 * Get a list of packing slips that are ready to be shipped.
 * This essentially means we just want packing slips that have not yet been assigned to a shipment.
 */
async function getQueue(_req, res) {
  handler(
    async () => {
      const packingSlips = await PackingSlip.find({ shipment: null })
        .populate('customer items.item')
        .lean()
        .exec();

      return [null, { packingSlips }];
    },
    "fetching shipping queue",
    res
  );
}

/**
 * Get a list of all shipments
 */
async function getAll(_req, res) {
  handler(
    async () => {
      const shipments = await Shipment.find().lean().exec();

      return [null, { shipments }];
    },
    "fetching shipments",
    res
  );
}

/**
 * Create a new shipment given an orderNumber & manifest
 * trackingNumber & cost are optional at this stage
 */
async function createOne(req, res) {
  handler(
    async () => {
      const { manifest, customer, trackingNumber, cost } = req.body;
      const p_numShipments = Shipment.countDocuments({ customer });
      const p_customerDoc = Customer.findOne({ _id: customer }).lean().exec();

      const [numShipments, customerDoc] = [
        await p_numShipments,
        await p_customerDoc,
      ];
      const { customerTag } = customerDoc;

      const shipmentId = `${customerTag}-SH${numShipments + 1}`;

      const shipment = new Shipment({
        customer,
        shipmentId,
        manifest,
        trackingNumber,
        cost,
      });

      await shipment.save();

      // update all packing slips in manifest w/ this shipment's id
      const promises = manifest.map((x) =>
        PackingSlip.updateOne({ _id: x }, { $set: { shipment: shipment._id } })
      );
      await Promise.all(promises);

      return [null, { shipment }];
    },
    "creating shipment",
    res
  );
}

/**
 * Get a specified shipment by mongo _id
 */
async function getOne(req, res) {
  handler(
    async () => {
      const { sid } = req.params;
      const shipment = await Shipment.findById(sid)
        .populate("customer")
        .populate({
          path: 'manifest',
          populate: 'items.item'
        })
        .lean()
        .exec();

      return [null, { shipment }];
    },
    "fetching shipment",
    res
  );
}

/**
 * Edit a specified shipment given its mongo _id & its new array items[]
 */
async function editOne(req, res) {
  handler(
    async () => {
      const { sid } = req.params;
      const { manifest } = req.body;

      await Shipment.updateOne(
        { _id: sid },
        {
          $set: {
            manifest,
          },
        }
      );

      return [null];
    },
    "editing shipment",
    res
  );
}

/**
 * Delete a specified shipment given its mongo _id
 */
async function deleteOne(req, res) {
  handler(
    async () => {
      const { sid } = req.params;

      await Shipment.deleteOne({ _id: sid });
      return [null];
    },
    "deleting shipment",
    res
  );
}
