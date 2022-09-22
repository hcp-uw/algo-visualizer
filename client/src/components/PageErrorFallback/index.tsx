import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PageErrorFallback.css";

const PageErrorFallback = ({ ...props }) => {
    return (
        <>
            <div id="error-message">
                <FontAwesomeIcon icon={["fas", "meteor"]} className="fa" />
                <h2>Whooops...</h2>
                <div>something went wrong...</div>
                <a href="./">Back to home page</a>
            </div>
        </>
    );
};

export default PageErrorFallback;
