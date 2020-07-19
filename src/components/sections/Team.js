import React, { useContext } from "react";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import { AuthContext } from "../context/Auth";

const propTypes = {
  ...SectionTilesProps.types,
};

const defaultProps = {
  ...SectionTilesProps.defaults,
};

const Team = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {
  //auth hook

  const { currentUser, pending } = useContext(AuthContext);
  const history = useHistory();

  const outerClasses = classNames(
    "testimonial section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "testimonial-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const tilesClasses = classNames("tiles-wrap", pushLeft && "push-left");

  const sectionHeader = {
    title: "Our Team",
  };

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            <div
              className="tiles-item reveal-from-right"
              data-reveal-delay="200"
            >
              <div
                class="card"
                style={{
                  backgroundColor: "white",
                  borderRadius: "15% 0 15% 0",
                }}
              >
                <img
                  style={{
                    borderRadius: "15% 0 0 0",
                  }}
                  class="card-img-top"
                  src={require("./../../assets/images/ceo.jpeg")}
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h3
                    style={{
                      color: "black",
                      textAlign: "center",
                      marginTop: "0",
                    }}
                  >
                    Henrik Povlsen
                  </h3>
                  <h5
                    style={{
                      color: "#5658DD",
                      textAlign: "center",
                      marginTop: "0",
                      fontWeight: "600",
                    }}
                  >
                    Founder
                  </h5>
                  <hr></hr>
                  <h6
                    style={{
                      color: "black",
                      textAlign: "center",
                      marginTop: "0",
                      fontSize: ".5em",
                      fontWeight: "400",
                    }}
                  >
                    Henrik is a visionary leader with over 17 years in the
                    financial sector. During these 17 years, Henrik has founded
                    4 organizations whose annual profit increases over 14%
                    yearly.
                  </h6>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-top" data-reveal-delay="200">
              <div
                class="card"
                style={{
                  backgroundColor: "white",
                  borderRadius: "15% 0 15% 0",
                }}
              >
                <img
                  style={{
                    borderRadius: "15% 0 0 0",
                  }}
                  class="card-img-top"
                  src={require("./../../assets/images/ceo.jpeg")}
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h3
                    style={{
                      color: "black",
                      textAlign: "center",
                      marginTop: "0",
                    }}
                  >
                    Pernille Skou
                  </h3>
                  <h5
                    style={{
                      color: "#5658DD",
                      textAlign: "center",
                      marginTop: "0",
                      fontWeight: "600",
                    }}
                  >
                    Chief Executive Officer
                  </h5>
                  <hr></hr>
                  <h6
                    style={{
                      color: "black",
                      textAlign: "center",
                      marginTop: "0",
                      fontSize: ".5em",
                      fontWeight: "400",
                    }}
                  >
                    Pernille has over 12 years of experience in the financial
                    sector and has managed over 8 finacial organizations.She is
                    an innovative leader who manages both staff and clients
                    perfectly.
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="tiles-item reveal-from-bottom"
              data-reveal-delay="200"
            >
              <div
                class="card"
                style={{
                  backgroundColor: "white",
                  borderRadius: "15% 0 15% 0",
                }}
              >
                <img
                  style={{
                    borderRadius: "15% 0 0 0",
                  }}
                  class="card-img-top"
                  src={require("./../../assets/images/ceo.jpeg")}
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h3
                    style={{
                      color: "black",
                      textAlign: "center",
                      marginTop: "0",
                      fontWeight: "600",
                    }}
                  >
                    Jane Cooks
                  </h3>
                  <h5
                    style={{
                      color: "#5658DD",
                      textAlign: "center",
                      marginTop: "0",
                      fontWeight: "400",
                    }}
                  >
                    Chief Marketing Officer
                  </h5>
                  <hr></hr>
                  <h6
                    style={{
                      color: "black",
                      textAlign: "center",
                      marginTop: "0",
                      fontSize: ".5em",
                      fontWeight: "400",
                    }}
                  >
                    Jane has over 11 years in marketing, strategic planning and
                    corporate communication. During her past 11 years in the
                    industry, she has worked with 4 top-notch financial
                    institution all over the world.
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Team.propTypes = propTypes;
Team.defaultProps = defaultProps;

export default Team;
