const Button = ({ className, children, ...props }) => {
    return (
        <button
            {...props}
            className={`bg-blue-500 text-white p-2 w-32 rounded-md ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;