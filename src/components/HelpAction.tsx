import "./HelpAction.scss";

type HelpActionProps = {
    onClick: () => unknown;
    children: string | JSX.Element | JSX.Element[];
};

function HelpAction (props: HelpActionProps) {
    const { onClick, children } = props;

    return (
        <div className="help-action" onClick={onClick}>{children}</div>
    )
}

export default HelpAction;
