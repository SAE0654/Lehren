import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
    const { email } = req.body;
    try {
        await sendgrid.send({
            to: email,
            from: "l.alcantara@saei.mx",
            subject: "This a testing email motherfucker",
            html: `<div>Yes, it is.<div>`
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({ error: error.message });
    }

    return res.status(200).json({ error: "" });
}

export default sendEmail;
