import Help from "./components/HelpAction";
import Popup from "./components/Popup";
import Tag from "./components/Tag";

import { keybindings } from "./keybindings";

type HelpPopupProps = {
    showPopup: boolean;
    onToggle: (isVisible: boolean) => unknown;
}

function HelpPopup (props: HelpPopupProps) {
    const { showPopup, onToggle } = props;

    function showHelpPopup () {
        onToggle(true);
    }

    function hideHelpPopup () {
        onToggle(false);
    }

    const keybindingsTable = Object.entries(keybindings).map(([key, values], index) => {
        const bindings = values.map((value: string, index) => {
            if (value === " ") {
                return <Tag key={index}>Space</Tag>

            }
            return <Tag key={index}>{value}</Tag>
        });

        return (
            <tr key={index}>
                <td className="capitalize">{key.split("_").join(" ")}</td>
                <td className="capitalize">{bindings}</td>
            </tr>
        )
    });

    return (
        <div className="help">
            <Popup show={showPopup} onClose={hideHelpPopup}>
                <table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Keybindings</th>
                        </tr>
                    </thead>

                    <tbody>{keybindingsTable}</tbody>
                </table>
            </Popup>
            <Help onClick={showHelpPopup}>?</Help>
        </div>

    )
}

export default HelpPopup;
