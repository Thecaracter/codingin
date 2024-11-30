interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary'
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`px-6 py-2 rounded-lg font-medium transition-colors
          ${variant === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}`}
        >
            {children}
        </button>
    )
}