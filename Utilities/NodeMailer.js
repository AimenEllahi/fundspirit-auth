import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email-address@gmail.com",
    pass: "your-email-password",
  },
});

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

export const sendEmail = (email, name) => {
  const mailOptions = {
    from: "your-email-address@gmail.com",
    to: email,
    subject: "Congratulations! Your NPO is approved!",
    text: `Dear ${name},

        I am thrilled to inform you that your NPO has been approved by our team! Congratulations on this achievement, and thank you for your interest in our campaigns.

        As an approved NPO, you now have access to our platform and can start enrolling in campaigns right away. To get started, please follow the link provided below to create your password and access your account:

        [Insert Link Here]

        Once you have created your password and logged in, you will be able to browse through our campaigns and enroll in those that align with your organization's mission and goals.

        We are excited to have you onboard and look forward to partnering with you to make a positive impact in our community. Please don't hesitate to reach out to us if you have any questions or need assistance with anything.

        Best regards,

        Hanan

        FundSpirit Team`,
  };
};
