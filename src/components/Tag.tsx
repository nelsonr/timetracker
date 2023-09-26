import "./Tag.scss";

type TagProps = {
    children: string | JSX.Element | JSX.Element[];
};

function Tag (props: TagProps) {
    const { children } = props;

    return (
        <span className="tag">{children}</span>
    )
}

export default Tag;
