const PrivacyPolicy = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#334155",
        lineHeight: 1.8,
      }}
    >
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "clamp(20px, 5vw, 50px)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <header
          style={{
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "20px",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ color: "#0f172a", fontSize: "36px" }}>
            Privacy Policy
          </h1>

          <p>
            <strong>BHL CRM | Brickhill Landbase LLP</strong>
          </p>

          <p>Last Updated: November 24, 2026</p>
        </header>

        <section>
          <h2>1. Introduction</h2>
          <p>
            BHL CRM is a customer relationship management
            platform operated by Brickhill Landbase LLP.
            This Privacy Policy explains how we collect,
            use, store, protect and manage personal
            information in connection with our real estate
            services and CRM operations.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            Depending on your interaction with our services,
            we may collect the following information:
          </p>
          <ul>
            <li>Full name</li>
            <li>Phone number and email address</li>
            <li>City and location information</li>
            <li>Property preferences and budget</li>
            <li>Information submitted through enquiry forms</li>
            <li>Customer communication and follow-up history</li>
            <li>Booking and transaction-related information</li>
            <li>Call recordings, where lawfully collected</li>
          </ul>
        </section>

        <section>
          <h2>3. Facebook and Instagram Lead Ads</h2>
          <p>
            We use Meta APIs and webhook integrations to
            receive information voluntarily submitted by
            individuals through Facebook and Instagram
            Lead Ads and Instant Forms.
          </p>
          <p>
            This information may be transferred to BHL CRM
            for enquiry management, customer communication,
            property consultation, sales follow-ups and
            related business operations.
          </p>
          <p>
            We do not sell Meta Platform Data or use it
            for purposes prohibited by Meta Platform Terms
            and applicable policies.
          </p>
        </section>

        <section>
          <h2>4. How We Use Your Information</h2>
          <ul>
            <li>Responding to property enquiries</li>
            <li>Managing customer relationships</li>
            <li>Assigning enquiries to authorized sales representatives</li>
            <li>Scheduling meetings and property site visits</li>
            <li>Providing relevant project information</li>
            <li>Managing bookings and customer documentation</li>
            <li>Improving our services and business operations</li>
            <li>Complying with applicable legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Storage and Security</h2>
          <p>
            Personal information may be stored using cloud
            infrastructure and database services, including
            Amazon Web Services and MongoDB Atlas.
          </p>
          <p>
            We aim to protect personal information through
            appropriate technical and organizational
            safeguards, including authentication, access
            controls and secure communication.
          </p>
          <p>
            Access to customer information is restricted
            to authorized personnel based on their
            business responsibilities.
          </p>
        </section>

        <section>
          <h2>6. Data Sharing</h2>
          <p>
            We do not sell personal information. Information
            may be shared with authorized employees,
            relevant service providers and business
            representatives where necessary to respond to
            enquiries or provide requested services.
          </p>
          <p>
            Information may also be disclosed where
            required by applicable law or a valid
            legal obligation.
          </p>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain personal information only for as long
            as reasonably necessary for the purposes for
            which it was collected, legitimate business
            requirements and applicable legal obligations.
            Information that is no longer required will
            be deleted or anonymized as appropriate.
          </p>
        </section>

        <section>
          <h2>8. User Rights and Data Deletion</h2>
          <p>
            Subject to applicable law, individuals may
            request access to, correction of or deletion
            of their personal information. Individuals
            may also withdraw consent where processing
            is based on consent.
          </p>
          <p>
            To request deletion of information collected
            through Facebook, Instagram or other sources,
            contact us using the email address provided
            below with the subject line:
          </p>

          <p>
            <strong>BHL CRM - Data Deletion Request</strong>
          </p>

          <p>
            Please include sufficient information to help
            us identify your record. We may verify your
            identity before processing the request.
            Requests will be handled in accordance with
            applicable legal requirements.
          </p>
        </section>

        <section>
          <h2>9. Third-Party Services</h2>
          <p>
            Our CRM may integrate with third-party
            platforms, including Meta, Amazon Web Services
            and MongoDB Atlas. These services may process
            information in accordance with their applicable
            privacy policies and contractual obligations.
          </p>
        </section>

        <section>
          <h2>10. Cookies and Authentication</h2>
          <p>
            BHL CRM may use cookies, browser storage and
            authentication technologies to maintain user
            sessions, support platform functionality and
            protect authorized access.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically
            to reflect changes in our services, data
            processing practices or legal requirements.
            Updated versions will be published on this page.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            For privacy-related questions, complaints or
            data deletion requests, please contact:
          </p>

          <p>
            <strong>Brickhill Landbase LLP</strong>
          </p>

          <p>Gurugram, Haryana, India</p>

          <p>
            Email:{" "}
            <a href="mailto:info@brickhillgroup.com">
            info@brickhillgroup.com
            </a>
          </p>

          <p>
            Website:{" "}
            <a href="https://bhlcrm.com">
              https://bhlcrm.com
            </a>
          </p>
        </section>

        <footer
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          © {new Date().getFullYear()} Brickhill Landbase LLP.
          All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicy;