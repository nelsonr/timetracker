import { getClassName } from "../utils";

import "./FeedbackMessage.scss";

type FeedbackMessageProps = {
    message: string;
    show: boolean;
};

function FeedbackMessage (props: FeedbackMessageProps) {
    const { message, show } = props;

    const className = getClassName([
        "feedback-message",
        (show ? "feedback-message--show" : "")
    ]);

    return (
        <div className={className}>
            <div className="feedback-message__text">{message}</div>
        </div>
    )
}

export default FeedbackMessage;
