"use client"
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
    const router = useRouter();

    return (
        <div className="flex justify-center py-16 w-screen min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black dark:text-white/90 dark:[background-image:linear-gradient(45deg,#000000aa_16%,#312e8130,#581c8749,#83184330,black_84%)]">
            <div className="flex flex-col gap-2 max-w-2xl w-screen">
                <Button variant="light" className="max-w-fit" onClick={() => router.back()}>← back</Button>
                <div className="px-6 py-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                    <p className="text-sm text-gray-600 mb-6">Last Updated: 29th December 2024</p>

                    <p className="mb-4">
                        Your privacy is important to us. This Privacy Policy explains how StudyPhii collects, uses, and protects your information when you use our platform and services.
                    </p>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                        <div className="space-y-4">
                            <h3 className="font-semibold">1.1 Personal Information</h3>
                            <p>
                                We may collect personal information when you create an account, subscribe to our services, or interact with the platform. This may include:
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Payment information (processed securely through third-party payment processors)</li>
                            </ul>

                            <h3 className="font-semibold">1.2 Non-Personal Information</h3>
                            <p>
                                We collect non-personal information automatically when you use StudyPhii, such as:
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Browser type and operating system</li>
                                <li>IP address</li>
                                <li>Device information</li>
                                <li>Usage data (e.g., time spent on the platform, features accessed)</li>
                            </ul>

                            <h3 className="font-semibold">1.3 User-Generated Content</h3>
                            <p>
                                If you upload or input content into StudyPhii, we may collect and process this content as part of providing our services.
                            </p>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                        <div className="space-y-4">
                            <h3 className="font-semibold">2.1 To Provide and Improve Our Services</h3>
                            <ul className="list-disc pl-6">
                                <li>Delivering AI-generated content</li>
                                <li>Enhancing platform performance and user experience</li>
                            </ul>

                            <h3 className="font-semibold">2.2 For Account Management and Customer Support</h3>
                            <ul className="list-disc pl-6">
                                <li>Communicating with you about your account, subscription, and updates</li>
                                <li>Addressing questions or issues you may have</li>
                            </ul>

                            <h3 className="font-semibold">2.3 For Marketing Purposes</h3>
                            <ul className="list-disc pl-6">
                                <li>Sending promotional materials and updates (you can opt-out at any time)</li>
                            </ul>

                            <h3 className="font-semibold">2.4 To Ensure Security and Prevent Fraud</h3>
                            <ul className="list-disc pl-6">
                                <li>Detecting and preventing unauthorized access or misuse of our platform</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">3. How We Share Your Information</h2>
                        <div className="space-y-4">
                            <h3 className="font-semibold">3.1 Third-Party Service Providers</h3>
                            <p>
                                We may share your information with trusted third-party providers who help us operate StudyPhii, such as payment processors and analytics tools.
                            </p>

                            <h3 className="font-semibold">3.2 Legal Obligations</h3>
                            <p>
                                We may disclose your information if required to do so by law or in response to valid legal requests.
                            </p>

                            <h3 className="font-semibold">3.3 Business Transfers</h3>
                            <p>
                                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
                            </p>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
                        <div className="space-y-4">
                            <h3 className="font-semibold">4.1</h3>
                            <p>
                                StudyPhii uses cookies and similar technologies to:
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Analyze platform usage</li>
                                <li>Improve functionality</li>
                                <li>Personalize your experience</li>
                            </ul>

                            <h3 className="font-semibold">4.2</h3>
                            <p>
                                You can manage your cookie preferences through your browser settings.
                            </p>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                        <div className="space-y-4">
                            <h3 className="font-semibold">5.1</h3>
                            <p>
                                We implement appropriate technical and organizational measures to protect your information from unauthorized access, alteration, or disclosure.
                            </p>

                            <h3 className="font-semibold">5.2</h3>
                            <p>
                                While we strive to protect your data, no method of transmission over the internet or electronic storage is 100% secure.
                            </p>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                        <div className="space-y-4">
                            <h3 className="font-semibold">6.1 Access and Correction</h3>
                            <p>
                                You can access and update your personal information through your account settings.
                            </p>

                            <h3 className="font-semibold">6.2 Data Deletion</h3>
                            <p>
                                You can request the deletion of your account and associated data by contacting us at <a href="mailto:support@studyphii.com" className="text-blue-500">support@studyphii.com</a>.
                            </p>

                            <h3 className="font-semibold">6.3 Marketing Preferences</h3>
                            <p>
                                You can opt-out of receiving promotional emails by following the unsubscribe instructions in the email.
                            </p>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
                        <p>
                            StudyPhii may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">8. Children’s Privacy</h2>
                        <p>
                            StudyPhii is not intended for children under the age of 13. We do not knowingly collect personal information from children without parental consent.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Changes will take effect immediately upon posting to our platform. Continued use of StudyPhii after changes constitutes your acceptance of the revised policy.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                        <p>
                            If you have questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:dev@phii.space" className="text-blue-500">dev@phii.space</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}