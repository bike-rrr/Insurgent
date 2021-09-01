const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
    apiKey: "97536413",
    apiSecret: "m4ZupVcMBYdyrVwj"
})

const from = "18443978464";
const to = "17086555140";
const text = "testing";

const textNumber = (message) => {
    vonage.message.sendSms(from, to, message, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {

            console.log('message worked', text);
        }
    });
}

module.exports = {
    textNumber
}