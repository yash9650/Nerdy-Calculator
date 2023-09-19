import { Spinner } from "react-bootstrap";

export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  buttonType?: "button" | "submit" | "reset";
  minWidth?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}> = (props) => {
  return (
    <button
      className={`btn btn-primary ${props.className}`}
      disabled={props.disabled || props.loading}
      onClick={props.onClick}
      type={props.buttonType || "button"}
    >
      {props.loading ? (
        <div
          style={{
            minWidth: props.minWidth || "60px",
          }}
        >
          <Spinner animation="border" size="sm" />
        </div>
      ) : (
        props.children
      )}
    </button>
  );
};
