export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm mt-10">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Inclusable. All rights reserved.</p>
      </div>
    </footer>
  )
}
