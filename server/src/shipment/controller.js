const { Router } = require("express");
const router = Router();
const Shipment = require("./model");
const PackingSlip = require("../packingSlip/model");
const Customer = require("../customer/model");
const handler = require("../handler");

module.exports = router;

router.get("/", getAll);
router.put("/", createOne);

router.get("/queue", getQueue);

router.get("/:sid", getOne);
router.patch("/:sid", editOne);
router.delete("/:sid", deleteOne);

async function getQueue(_req, res) {
  handler(
    async () => {
      const packingSlips = await PackingSlip.find({ shipment: null })
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
      const shipments = await Shipment.find()
        .populate("customer")
        .lean()
        .exec();

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

      const shipment = await Shipment.findById(sid).lean().exec();

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
