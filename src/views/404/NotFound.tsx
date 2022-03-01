import TitanoLogo from "../../assets/icons/titano.svg";
 
export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://titano.finance" target="_blank">
          <img className="branding-header-icon" src={TitanoLogo} alt="Titano" />
        </a>

        <h4>Page not found</h4>
      </div>
    </div>
  );
}
