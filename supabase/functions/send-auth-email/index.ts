// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import * as React from "https://esm.sh/react@18.3.1";
import { render } from "https://esm.sh/@react-email/render@0.0.12";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "https://esm.sh/@react-email/components@0.0.22";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// HeftCoder branded email template
const HeftCoderAuthEmail = ({
  type,
  token,
  token_hash,
  redirect_to,
  supabase_url,
  email_action_type,
}: {
  type: string;
  token: string;
  token_hash: string;
  redirect_to: string;
  supabase_url: string;
  email_action_type: string;
}) => {
  const logoUrl = "https://pmgqviuvrliqkipfntsn.supabase.co/storage/v1/object/public/email-assets/heftcoder-logo.png?v=1";
  const actionUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

  const getContent = () => {
    switch (email_action_type) {
      case "signup":
      case "email":
        return {
          preview: "Confirm your HeftCoder account",
          heading: "Confirm Your Email",
          text: "Welcome to HeftCoder! Click the button below to confirm your email address and start building amazing projects.",
          buttonText: "Confirm Email",
        };
      case "recovery":
      case "magiclink":
        return {
          preview: "Reset your HeftCoder password",
          heading: "Reset Your Password",
          text: "You requested to reset your password. Click the button below to set a new password for your HeftCoder account.",
          buttonText: "Reset Password",
        };
      case "invite":
        return {
          preview: "You've been invited to HeftCoder",
          heading: "You're Invited!",
          text: "You've been invited to join HeftCoder. Click the button below to accept the invitation and set up your account.",
          buttonText: "Accept Invitation",
        };
      case "email_change":
        return {
          preview: "Confirm your new email address",
          heading: "Confirm Email Change",
          text: "You requested to change your email address. Click the button below to confirm your new email.",
          buttonText: "Confirm New Email",
        };
      default:
        return {
          preview: "Action required for your HeftCoder account",
          heading: "Verify Your Account",
          text: "Please click the button below to complete the action for your HeftCoder account.",
          buttonText: "Verify",
        };
    }
  };

  const content = getContent();

  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, content.preview),
    React.createElement(
      Body,
      { style: mainStyle },
      React.createElement(
        Container,
        { style: containerStyle },
        // Logo section
        React.createElement(
          Section,
          { style: logoSectionStyle },
          React.createElement(Img, {
            src: logoUrl,
            alt: "HeftCoder",
            width: "60",
            height: "60",
            style: logoStyle,
          }),
          React.createElement(
            Text,
            { style: brandNameStyle },
            "HeftCoder"
          )
        ),
        // Main content
        React.createElement(
          Section,
          { style: contentSectionStyle },
          React.createElement(Heading, { style: headingStyle }, content.heading),
          React.createElement(Text, { style: textStyle }, content.text),
          React.createElement(
            Section,
            { style: buttonSectionStyle },
            React.createElement(
              Link,
              { href: actionUrl, style: buttonStyle },
              content.buttonText
            )
          ),
          React.createElement(
            Text,
            { style: codeTextStyle },
            "Or use this code: ",
            React.createElement("strong", null, token)
          )
        ),
        // Footer
        React.createElement(
          Section,
          { style: footerSectionStyle },
          React.createElement(
            Text,
            { style: footerTextStyle },
            "If you didn't request this email, you can safely ignore it."
          ),
          React.createElement(
            Text,
            { style: footerTextStyle },
            "© 2025 HeftCoder. All rights reserved."
          )
        )
      )
    )
  );
};

// Styles
const mainStyle = {
  backgroundColor: "#0a0a0a",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const containerStyle = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const logoSectionStyle = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logoStyle = {
  borderRadius: "12px",
};

const brandNameStyle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  marginTop: "12px",
  marginBottom: "0",
};

const contentSectionStyle = {
  backgroundColor: "#111111",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "40px 32px",
  textAlign: "center" as const,
};

const headingStyle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "0",
  marginBottom: "16px",
};

const textStyle = {
  color: "#a3a3a3",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "32px",
};

const buttonSectionStyle = {
  marginBottom: "24px",
};

const buttonStyle = {
  backgroundColor: "#ea580c",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "14px 32px",
  textDecoration: "none",
};

const codeTextStyle = {
  color: "#737373",
  fontSize: "14px",
};

const footerSectionStyle = {
  marginTop: "32px",
  textAlign: "center" as const,
};

const footerTextStyle = {
  color: "#525252",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "4px 0",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get hook secret for webhook verification
    const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
    
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    let emailData: {
      user: { email: string };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
      };
    };

    // If hook secret is configured, verify webhook signature
    if (hookSecret) {
      const wh = new Webhook(hookSecret);
      emailData = wh.verify(payload, headers) as typeof emailData;
    } else {
      // Parse directly if no hook secret (for testing)
      emailData = JSON.parse(payload);
    }

    const { user, email_data } = emailData;
    const { token, token_hash, redirect_to, email_action_type } = email_data;

    console.log("Sending branded email to:", user.email, "type:", email_action_type);

    // Render the React Email template
    const html = render(
      React.createElement(HeftCoderAuthEmail, {
        type: email_action_type,
        token,
        token_hash,
        redirect_to,
        supabase_url: Deno.env.get("SUPABASE_URL") || "",
        email_action_type,
      })
    );

    // Get subject based on email type
    const getSubject = (type: string): string => {
      switch (type) {
        case "signup":
        case "email":
          return "Confirm your HeftCoder account";
        case "recovery":
        case "magiclink":
          return "Reset your HeftCoder password";
        case "invite":
          return "You're invited to HeftCoder";
        case "email_change":
          return "Confirm your new email address";
        default:
          return "Action required for your HeftCoder account";
      }
    };

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "HeftCoder <noreply@heftcoder.icu>",
      to: [user.email],
      subject: getSubject(email_action_type),
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending auth email:", message);
    
    return new Response(
      JSON.stringify({ error: { message } }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
