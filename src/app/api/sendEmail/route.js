import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import SendDidEmail from "@/email/send-did-email";
export async function POST(request) {
  try {
    const { name, userDid, email } = await request.json();

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });
    const emailHtml = render(<SendDidEmail name={name} did={userDid} />);
    const mailOption = {
      from: "afipmedlog.com",
      to: email,
      subject: "AFIP MEDLOG",
      html: emailHtml,
      // html: `
      //   <h3>Hello </h3>
      //    <p> Dr. ${name} will like you to share your medical record using the below DID</p>
      //   <p> <strong> ${userDid} </strong> </p>
      //   `,
    };

    await transporter.sendMail(mailOption);

    return NextResponse.json(
      { message: "Email Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to Send Email" },
      { status: 500 }
    );
  }
}
