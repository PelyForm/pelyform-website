const router = require("express").Router();
const nodemailer = require("nodemailer");

const myEmail = "tausif@pelyform.com";
const myPassword = "Express@nn11";  // It's recommended to use environment variables for sensitive data

router.use('/', async (req, res) => {
    const { name, email, company, message } = req.body;

    // Check if email is present
    if (!email || email.trim() === "") {
        // Redirect to an error page or the original form
        return res.redirect('/'); // You can replace '/' with the appropriate route
    }

    // Create a transporter for GoDaddy email service
    let transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',  // GoDaddy's SMTP host
        port: 465,                         // Secure port for SSL/TLS
        secure: true,                      // Use SSL/TLS
        auth: {
            user: myEmail,
            pass: myPassword
        }
    });

    // Set up email data
    let mailOptions = {
        from: `"Pelyform Leads" <${myEmail}>`, // Sender address
        to: 'tausif@pelyform.com',      // List of recipients (replace with actual recipient)
        subject: 'Pelyform New Leads',         // Subject line
        text: `You have a new form submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`, // Plain text body
        html: `<p>Information:</p>
               <ul>
                   <li><strong>Name:</strong> ${name}</li>
                   <li><strong>Email:</strong> ${email}</li>
                   <li><strong>Company:</strong> ${company || "Not mentioned"}</li>
                   <li><strong>Message:</strong> ${message}</li>
               </ul>` // HTML body
    };

    try {
        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        // Render success page
        res.render('layout', { page: 'success', title: "Form Submitted" });

    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).send("An error occurred while sending the email.");
    }
});

module.exports = router;
