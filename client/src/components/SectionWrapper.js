import { Link } from "react-router-dom";
import { StyledSecton } from "../styles";

const SectionWrapper = ({ children, title, seeAllLink, breadcrumb }) => {
  return (
    <StyledSecton>
      <div className="section__inner">
        <div className="section__top">
          <h2 className="section__heading">
            {breadcrumb && (
              <span className="section__breadcrumb">
                <Link to="/">Profile</Link>
              </span>
            )}
            {title && (
              <>
                {seeAllLink ? (
                  <Link to={seeAllLink}>{title}</Link>
                ) : (
                  <span>{title}</span>
                )}
              </>
            )}
          </h2>
          {seeAllLink && (
            <Link to={seeAllLink} className="section__see-all">
              See All
            </Link>
          )}
        </div>
        {children}
      </div>
    </StyledSecton>
  );
};

export default SectionWrapper;
