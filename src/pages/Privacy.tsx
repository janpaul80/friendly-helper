import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Shield, Eye, Lock, Database, Globe, UserCheck, Bell, Trash2, Mail, FileText } from "lucide-react";
import { Footer } from "@/components/marketing/Footer";

export default function Privacy() {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Information You Provide",
          text: "When you create an account, we collect your name, email address, and password. If you choose to upgrade to a paid plan, we collect payment information through our secure payment processor (Stripe). We never store your full credit card number on our servers."
        },
        {
          subtitle: "Information Collected Automatically",
          text: "When you use HeftCoder, we automatically collect certain information including your IP address, browser type, device information, and usage data such as the pages you visit, features you use, and the time and duration of your sessions."
        },
        {
          subtitle: "Project Data",
          text: "We collect and store the code, files, and project data you create using HeftCoder. This data is essential for providing our services and is stored securely on encrypted servers."
        },
        {
          subtitle: "Communications",
          text: "If you contact us directly, we may receive additional information about you such as your name, email address, the contents of the message and/or attachments you may send us, and any other information you choose to provide."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to provide, maintain, and improve HeftCoder, including processing transactions, sending service-related communications, and providing customer support."
        },
        {
          subtitle: "Product Improvement",
          text: "We analyze usage patterns to understand how our services are being used and to identify areas for improvement. This helps us build better features and fix issues more quickly."
        },
        {
          subtitle: "Security & Fraud Prevention",
          text: "We use your information to detect, investigate, and prevent fraudulent transactions, abuse, and other illegal activities, and to protect the rights and safety of HeftCoder and our users."
        },
        {
          subtitle: "Marketing Communications",
          text: "With your consent, we may send you promotional communications about new features, products, and services. You can opt out of these communications at any time."
        }
      ]
    },
    {
      id: "data-sharing",
      title: "Information Sharing & Disclosure",
      icon: Globe,
      content: [
        {
          subtitle: "Service Providers",
          text: "We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service. These providers are bound by contractual obligations to keep your information confidential."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency). We will notify you of such requests unless legally prohibited."
        },
        {
          subtitle: "Business Transfers",
          text: "If HeftCoder is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any change in ownership or uses of your personal information."
        },
        {
          subtitle: "With Your Consent",
          text: "We may share your information for other purposes with your explicit consent. You always have the right to withdraw consent at any time."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          text: "All data transmitted between your browser and our servers is encrypted using TLS 1.3. Data at rest is encrypted using AES-256 encryption. Your project files and source code are stored in encrypted form."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls to ensure that only authorized personnel can access your data. All access is logged and regularly audited."
        },
        {
          subtitle: "Infrastructure Security",
          text: "Our infrastructure is hosted on enterprise-grade cloud providers with SOC 2 Type II certification. We employ firewalls, intrusion detection systems, and regular security assessments."
        },
        {
          subtitle: "Incident Response",
          text: "We have a comprehensive incident response plan in place. In the event of a data breach, we will notify affected users within 72 hours as required by applicable regulations."
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights & Choices",
      icon: UserCheck,
      content: [
        {
          subtitle: "Access & Portability",
          text: "You have the right to request access to the personal information we hold about you. You can also request a copy of your data in a commonly used, machine-readable format."
        },
        {
          subtitle: "Correction & Deletion",
          text: "You can update your account information at any time through your dashboard. You may also request that we correct any inaccurate information or delete your personal data, subject to legal retention requirements."
        },
        {
          subtitle: "Opt-Out Rights",
          text: "You can opt out of marketing communications by clicking the unsubscribe link in any email or updating your notification preferences in your account settings."
        },
        {
          subtitle: "Do Not Track",
          text: "Some browsers include a \"Do Not Track\" feature. We currently do not respond to Do Not Track signals, but we provide other privacy controls as described in this policy."
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: Bell,
      content: [
        {
          subtitle: "Essential Cookies",
          text: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms."
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand how visitors interact with our website. This helps us improve our services. You can opt out of analytics tracking in your account settings."
        },
        {
          subtitle: "Preference Cookies",
          text: "These cookies enable the website to remember choices you make (such as your language or region) and provide enhanced, more personal features."
        },
        {
          subtitle: "Third-Party Cookies",
          text: "Some of our pages may contain content from third parties (like embedded videos) that may set their own cookies. We do not control the use of such cookies and recommend reviewing the privacy policies of these third parties."
        }
      ]
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: Trash2,
      content: [
        {
          subtitle: "Active Accounts",
          text: "We retain your personal information for as long as your account is active or as needed to provide you services. Project data is retained until you delete it or close your account."
        },
        {
          subtitle: "Closed Accounts",
          text: "When you close your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal or legitimate business purposes."
        },
        {
          subtitle: "Backup Retention",
          text: "Backup copies of your data may be retained for up to 90 days for disaster recovery purposes. After this period, all backup data is permanently deleted."
        },
        {
          subtitle: "Legal Holds",
          text: "In some cases, we may be required to retain your information for longer periods due to legal obligations, such as tax laws or to resolve disputes."
        }
      ]
    },
    {
      id: "international",
      title: "International Data Transfers",
      icon: Globe,
      content: [
        {
          subtitle: "Data Location",
          text: "Your data is primarily stored in data centers located in the United States. We may transfer your data to other countries where we or our service providers operate."
        },
        {
          subtitle: "Safeguards",
          text: "When we transfer data internationally, we implement appropriate safeguards such as Standard Contractual Clauses (SCCs) approved by the European Commission to ensure your data receives adequate protection."
        },
        {
          subtitle: "EU/UK Users",
          text: "For users in the European Economic Area or United Kingdom, we comply with GDPR requirements and ensure that any data transfers outside the EU/UK are protected by appropriate legal mechanisms."
        }
      ]
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
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
              <p className="text-gray-400 mt-1">Your privacy matters to us</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            This Privacy Policy describes how HeftCoder ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services. We are committed to protecting your privacy and being transparent about our data practices.
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
          <nav className="grid sm:grid-cols-2 gap-2">
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

      {/* Content Sections */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((section, i) => (
            <div key={i} id={section.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <section.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((item, j) => (
                  <div key={j} className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                    <h3 className="text-lg font-semibold text-orange-400 mb-3">{item.subtitle}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
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
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h2>
            <p className="text-gray-400 mb-6">If you have any questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer.</p>
            <a href="mailto:privacy@heftcoder.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors">
              <Mail className="w-5 h-5" />
              privacy@heftcoder.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
