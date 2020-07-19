import React, { useContext, useState, useEffect } from "react";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import { AuthContext } from "../context/Auth";
import firebase from "../auth/firebase";

const propTypes = {
  ...SectionTilesProps.types,
};

const defaultProps = {
  ...SectionTilesProps.defaults,
};

const Plan = ({
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
  const [allPackage, setAllPackage] = useState([]);
  const db = firebase.firestore();

  //FETCH PACKAGE INFO
  useEffect(() => {
    const fetchData = async () => {
      let docRef = await db
        .collection("package")
        .onSnapshot((querySnapshot) => {
          setAllPackage(
            querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        });
    };
    fetchData();
  }, []);

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
    title: "Investment Package",
    paragraph: "Choose What fits you",
  };

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            {allPackage.map((item) => (
              <div
                className="tiles-item "
                data-reveal-delay="200"
                key={item.id}
              >
                <div class="card">
                  <img
                    class="card-img-top"
                    src={require("./../../assets/images/package_.svg")}
                    alt="Card image cap"
                  />
                  <div class="card-body">
                    <h4 class="card-title">
                      <span className="testimonial-item-link">
                        {item.packageName}
                      </span>
                    </h4>
                    <p class="card-text">
                      Minimum investment -{" "}
                      <span className="testimonial-item-link">
                        ${item.packageMinAmount}
                      </span>
                      <br></br>
                      Maximum investment -{" "}
                      <span className="testimonial-item-link">
                        ${item.packageMaxAmount}
                      </span>{" "}
                      <br></br>
                      Profit -{" "}
                      <span className="testimonial-item-link">
                        {item.profit}%
                      </span>{" "}
                      <br></br>
                      Duration -{" "}
                      <span className="testimonial-item-link">
                        {item.duration}
                      </span>{" "}
                      <br></br>
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* <div className="tiles-item reveal-from-top" data-reveal-delay="200">
              <div class="card">
                <img
                  class="card-img-top"
                  src={require("./../../assets/images/package_.svg")}
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h4 class="card-title">
                    <span className="testimonial-item-link">PRO PLAN</span>
                  </h4>
                  <p class="card-text">
                    Minimum investment -{" "}
                    <span className="testimonial-item-link">$500</span>
                    <br></br>
                    Maximum investment -{" "}
                    <span className="testimonial-item-link">$100,000</span>{" "}
                    <br></br>
                    Profit - <span className="testimonial-item-link">
                      10%
                    </span>{" "}
                    <br></br>
                    Duration -{" "}
                    <span className="testimonial-item-link">24 hours</span>{" "}
                    <br></br>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="tiles-item reveal-from-bottom"
              data-reveal-delay="200"
            >
              <div class="card" style={{ backgroundColor: "white" }}>
                <img
                  class="card-img-top"
                  src={require("./../../assets/images/package_.svg")}
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h4 class="card-title">
                    <span className="testimonial-item-link">VIP PLAN</span>
                  </h4>
                  <p class="card-text">
                    Minimum investment -{" "}
                    <span className="testimonial-item-link">$5,000</span>
                    <br></br>
                    Maximum investment -{" "}
                    <span className="testimonial-item-link">$500,000</span>{" "}
                    <br></br>
                    Profit - <span className="testimonial-item-link">
                      20%
                    </span>{" "}
                    <br></br>
                    Duration -{" "}
                    <span className="testimonial-item-link">5 days</span>{" "}
                    <br></br>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="tiles-item reveal-from-left"
              data-reveal-delay="200"
              >
              <div class="card">
                <img
                  class="card-img-top"
                  src={require("./../../assets/images/package_.svg")}
                  alt="Card image cap"
                />
                <div class="card-body">
                  <h4 class="card-title">
                    <span className="testimonial-item-link">
                      VIP TRIAL PLAN
                    </span>
                  </h4>
                  <p class="card-text">
                    Minimum investment -{" "}
                    <span className="testimonial-item-link">$1,000</span>
                    <br></br>
                    Maximum investment -{" "}
                    <span className="testimonial-item-link">$50,000</span>{" "}
                    <br></br>
                    Profit - <span className="testimonial-item-link">
                      20%
                    </span>{" "}
                    <br></br>
                    Duration -{" "}
                    <span className="testimonial-item-link">1 hour</span>{" "}
                    <br></br>
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

Plan.propTypes = propTypes;
Plan.defaultProps = defaultProps;

export default Plan;
