import { Link } from "react-router-dom";
import { ArrowLeft, Zap, FileText, Scale, AlertTriangle, Ban, CreditCard, Shield, Globe, Gavel, HelpCircle, CheckCircle, XCircle, Mail } from "lucide-react";
import { Footer } from "../components/marketing/Footer";

export default function Terms() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: `By accessing or using HeftCoder's website, applications, or services (collectively, the "Services"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our Services.

These Terms constitute a legally binding agreement between you and HeftCoder Inc. We may update these Terms from time to time, and your continued use of the Services after any changes constitutes acceptance of those changes. We will notify you of material changes via email or through the Services.`
    },
    {
      id: "eligibility",
      title: "Eligibility & Account Registration",
      icon: Shield,
      content: `To use our Services, you must be at least 18 years old or the age of majority in your jurisdiction, whichever is greater. By creating an account, you represent and warrant that you meet these requirements.

When creating an account, you agree to:
• Provide accurate, current, and complete information
• Maintain and promptly update your account information
• Maintain the security and confidentiality of your login credentials
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use of your account

We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe are being used fraudulently.`
    },
    {
      id: "services",
      title: "Description of Services",
      icon: Globe,
      content: `HeftCoder provides an AI-powered software development platform that enables users to create, edit, and deploy web applications. Our Services include:

• AI-assisted code generation and editing
• Project hosting and deployment
• Collaborative development tools
• Template libraries and starter kits
• API access for programmatic integration
• Customer support and documentation

We reserve the right to modify, suspend, or discontinue any part of the Services at any time, with or without notice. We will make reasonable efforts to provide advance notice of significant changes.`
    },
    {
      id: "user-content",
      title: "User Content & Intellectual Property",
      icon: FileText,
      content: `You retain ownership of all code, content, and materials you create using our Services ("User Content"). By using our Services, you grant HeftCoder a limited, non-exclusive license to store, process, and display your User Content solely for the purpose of providing the Services.

You represent and warrant that:
• You own or have the necessary rights to your User Content
• Your User Content does not infringe any third-party rights
• Your User Content complies with all applicable laws
• You have obtained all necessary consents for any personal data included in your User Content

HeftCoder and its licensors retain all rights to the Services, including all software, algorithms, interfaces, and documentation. Nothing in these Terms grants you any right to use HeftCoder's trademarks, logos, or brand features without prior written consent.`
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: Scale,
      content: `You agree not to use the Services to:

• Violate any applicable laws, regulations, or third-party rights
• Generate, store, or distribute malicious code, malware, or viruses
• Attempt to gain unauthorized access to our systems or other users' accounts
• Engage in any activity that could damage, disable, or impair the Services
• Use the Services to create competing products or services
• Scrape, data mine, or extract data from the Services without permission
• Send unsolicited communications, spam, or promotional materials
• Impersonate any person or entity or misrepresent your affiliation
• Create content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable
• Use AI-generated content to spread misinformation or create deepfakes

We reserve the right to investigate and take appropriate action against anyone who violates this policy, including removing content, suspending accounts, and reporting to law enforcement.`
    },
    {
      id: "payment",
      title: "Payment & Billing",
      icon: CreditCard,
      content: `Certain features of the Services require payment of fees. By subscribing to a paid plan, you agree to pay all applicable fees as described on our pricing page.

Billing Terms:
• Subscriptions are billed in advance on a monthly or annual basis
• All fees are non-refundable except as expressly stated in these Terms
• We may change our prices with 30 days' notice
• Failed payments may result in suspension of your account
• You are responsible for all taxes associated with your subscription

Cancellation:
• You may cancel your subscription at any time through your account settings
• Cancellation takes effect at the end of your current billing period
• You will retain access to paid features until the end of your billing period
• No partial refunds are provided for unused portions of a billing period

Refunds:
• We offer a 14-day money-back guarantee for new subscriptions
• Refund requests must be submitted within 14 days of initial purchase
• Refunds are processed to the original payment method within 5-10 business days`
    },
    {
      id: "termination",
      title: "Termination",
      icon: XCircle,
      content: `Either party may terminate this agreement at any time for any reason. Upon termination:

By You:
• You may close your account through your account settings
• You must pay any outstanding fees before account closure
• We will provide a reasonable opportunity to export your data

By HeftCoder:
• We may terminate your account for violation of these Terms
• We may terminate your account for extended periods of inactivity
• We may terminate your account if required by law

Effects of Termination:
• All licenses granted to you under these Terms will immediately cease
• We may delete your User Content after a reasonable retention period (typically 30 days)
• Provisions regarding intellectual property, liability, and dispute resolution survive termination`
    },
    {
      id: "disclaimer",
      title: "Disclaimers & Warranties",
      icon: AlertTriangle,
      content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, HEFTCODER DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:

• IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
• WARRANTIES OF NON-INFRINGEMENT
• WARRANTIES THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE
• WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF AI-GENERATED CODE

You acknowledge that:
• AI-generated code may contain errors or security vulnerabilities
• You are responsible for reviewing and testing all code before deployment
• HeftCoder does not guarantee that generated code will meet your requirements
• Use of the Services is at your own risk`
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: Ban,
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL HEFTCODER, ITS DIRECTORS, EMPLOYEES, PARTNERS, OR AFFILIATES BE LIABLE FOR:

• ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
• ANY LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES
• ANY DAMAGES RESULTING FROM UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA
• ANY DAMAGES ARISING FROM YOUR USE OF AI-GENERATED CODE IN PRODUCTION

OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO HEFTCODER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above limitations may not apply to you.`
    },
    {
      id: "indemnification",
      title: "Indemnification",
      icon: Shield,
      content: `You agree to indemnify, defend, and hold harmless HeftCoder and its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt arising from:

• Your use of the Services
• Your violation of these Terms
• Your violation of any third-party rights
• Your User Content
• Any application or code you create, deploy, or distribute using our Services

We reserve the right to assume exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims.`
    },
    {
      id: "disputes",
      title: "Dispute Resolution",
      icon: Gavel,
      content: `Any dispute arising from these Terms or your use of the Services shall be resolved as follows:

Informal Resolution:
Before filing any formal dispute, you agree to contact us and attempt to resolve the dispute informally for at least 30 days.

Governing Law:
These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.

Arbitration:
Any disputes not resolved informally shall be resolved through binding arbitration administered by the American Arbitration Association. The arbitration shall be conducted in English and take place in Wilmington, Delaware.

Class Action Waiver:
You agree that any arbitration or proceeding shall be limited to the dispute between you and HeftCoder individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.

Exceptions:
• Either party may seek injunctive relief in any court of competent jurisdiction
• Claims related to intellectual property may be brought in court`
    },
    {
      id: "general",
      title: "General Provisions",
      icon: HelpCircle,
      content: `Entire Agreement:
These Terms, together with our Privacy Policy and any other agreements referenced herein, constitute the entire agreement between you and HeftCoder regarding the Services.

Severability:
If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.

Waiver:
Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision.

Assignment:
You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations under these Terms without restriction.

Force Majeure:
Neither party shall be liable for any failure or delay resulting from circumstances beyond reasonable control, including natural disasters, war, terrorism, riots, or government actions.

Notices:
We may send notices to your registered email address. You may send notices to legal@heftcoder.com.`
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 py-4 px-6 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-orange-600 rounded flex items-center justify-center text-white">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-lg tracking-tighter">HeftCoder</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Scale className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
              <p className="text-gray-400 mt-1">Please read these terms carefully</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of the HeftCoder platform and services. By using our Services, you agree to be bound by these Terms. If you are using our Services on behalf of an organization, you are agreeing to these Terms on behalf of that organization.
          </p>
          <p className="text-gray-500 text-sm mt-4">Last updated: January 26, 2025</p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Table of Contents
          </h2>
          <nav className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sections.map((section, i) => (
              <a
                key={i}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-orange-400 transition-all"
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, i) => (
            <div key={i} id={section.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <section.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
            <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-gray-400 mb-6">If you have any questions about these Terms of Service, please contact our legal team.</p>
            <a href="mailto:legal@heftcoder.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors">
              <Mail className="w-5 h-5" />
              legal@heftcoder.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
