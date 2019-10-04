import sgMail from "@sendgrid/mail";

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

export const sendWelcomeEmail = (email, name) => {
  return sgMail.send({
    to: email,
    from: "diego.ivan.perez.michel@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to Task Manager app, ${name}. Task manager will help you organize the things you need to do.`
  });
};

export const sendCancelEmail = (email, name) => {
  return sgMail.send({
    to: email,
    from: "diego.ivan.perez.michel@gmail.com",
    subject: "We're sorry you are leaving!",
    text: `We hope to see you back soon ${name}, Task manager will continue to improve to give you a better experience next time.`
  });
};
