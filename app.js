const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/contact.html');
});

app.post('/send', async(req, res) => {


    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
          <li>Name: ${req.body.name}</li>
          <li>Company: ${req.body.company}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
      `;
    console.log(output);
    //============ TRANSPORTING SUBMISSION TO GMAIL=============//

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: false,
        port: 587,
        requireTLS: true,
        auth: {
            user: 'eddyhiuhu@gmail.com',
            pass: 'hiuhu2040'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    // setup email data with unicode symbols
    const mailOptions = {
        from: `${ req.body.email }`,
        to: 'eddyhiuhu@gmail.com',
        subject: `${req.body.name}`,
        text: `${req.body.message}`,
        html: output
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact');
    });
});

app.listen(5000, () => console.log('Server started...'));