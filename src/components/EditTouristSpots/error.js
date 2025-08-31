const ErrorMessage = ({ message, className }) =>
    message ? (
        <p className={className} style={{ color: "red" }}>
            {message}
        </p>
    ) : null;

export default ErrorMessage;
