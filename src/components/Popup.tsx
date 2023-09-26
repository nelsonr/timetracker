import { getClassName } from "../utils";
import "./Popup.scss";

type PopupProps = {
    show: boolean;
    onClose: () => unknown;
    children: string | JSX.Element | JSX.Element[];
};

function Popup (props: PopupProps) {
    const { show, onClose, children } = props;

    const className = getClassName([
        "popup",
        (show ? "popup--show" : ""),
    ]);

    function handleOnClose () {
        onClose();
    }

    return (
        <div className={className}>
            <div className="popup__overlay" onClick={handleOnClose}></div>
            <div className="popup__content">{children}</div>
        </div>
    )
}

export default Popup;
