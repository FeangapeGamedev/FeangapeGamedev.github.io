import { useRef, useState, lazy, Suspense } from "react";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css";

const Contact = ({ onClose }) => {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = ({ target: { name, value } }) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .send(
                import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
                {
                    from_name: form.name,
                    to_name: "Felipe A. Garcia",
                    from_email: form.email,
                    to_email: "feangape.gamedev@gmail.com",
                    message: form.message,
                },
                import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
            )
            .then(
                () => {
                    setLoading(false);
                    alert("Thank you for your message! 😊");
                    setForm({ name: "", email: "", message: "" });
                },
                (error) => {
                    setLoading(false);
                    console.error(error);
                    alert("Oops! Something went wrong. 😢");
                }
            );
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                Contact Me
                <button onClick={onClose} className="close-button">✖</button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                <label htmlFor="contact-name">Full Name</label>
                <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                />

                <label htmlFor="contact-email">Email</label>
                <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />

                <label htmlFor="contact-message">Your Message</label>
                <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter your message"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>

            <div className="contact-divider"></div>

            <div className="contact-bottom-section">
                {/* Resume Section */}
                <div className="contact-frame contact-resume">
                    <span>Download Resume</span>
                    <div className="resume-container" onClick={() => window.open("/your-resume.pdf", "_blank")}>
                        <img src="/portfolio_16672960.webp" alt="Resume Icon" className="resume-icon" loading="lazy" />
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="contact-frame contact-social">
                    <span>Social Media</span>
                    <div className="social-icons-container">
                        {/* LinkedIn */}
                        <div 
                            className="social-box linkedin-box" 
                            onClick={() => window.open("https://www.linkedin.com/in/felipe-andres-garcia-pereira-58ab5a347", "_blank")}
                        >
                            <img src="/InBug-White.webp" alt="LinkedIn Icon" className="social-icon linkedin-icon" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
