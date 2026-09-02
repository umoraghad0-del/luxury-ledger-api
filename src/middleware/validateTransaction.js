export function validateTransaction(req, res, next) {
  const {
    serialNumber,
    fromAddress,
    toAddress,
    timestamp
  } = req.body;

  if (!serialNumber || !fromAddress || !toAddress || !timestamp) {
    return res.status(400).json({
      error: "serialNumber, fromAddress, toAddress and timestamp are required"
    });
  }

  next();
}