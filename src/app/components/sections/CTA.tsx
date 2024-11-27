import Button from '../ui/Button'

export default function CTA() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
                <p className="text-xl text-gray-300 mb-8">
                    Let&apos;s build something amazing together
                </p>
                <Button>Contact Us</Button>
            </div>
        </section>
    )
}