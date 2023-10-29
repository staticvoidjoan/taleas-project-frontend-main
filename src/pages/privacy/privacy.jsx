import React from "react";
import Text from "../../components/text/text";
import "./privacy.css";
import { useTranslation } from "react-i18next";

const Privacy = (props) => {
  const { t } = useTranslation(["Translate"]);
  return (
    <>
      <div className="terms-container">
        {/* ----------------------------------------- terms-of-service"---------------------------------------- */}

        <div className="terms-of-service">
          <Text
            label={t("privacy.terms_head")}
            weight={"bold"}
            lineheight={"lnormal"}
            size={"s20"}
            color={"black"}
          />
          {/* ----------------------------------------- Acceptance of Terms ---------------------------------------- */}
          <div style={{ marginTop: "20px" }}>
            <Text
              label={t("privacy.terms1")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.t1")}</p>
          </div>

          {/* ----------------------------------------- Description of the Platform ---------------------------------------- */}

          <div>
            <Text
              label={t("privacy.terms2")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.t2")}</p>
          </div>

          {/* ----------------------------------------- Registration and User Accounts ---------------------------------------- */}

          <div>
            <Text
              label={t("privacy.terms3")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.t3")}</p>
          </div>

          {/* ----------------------------------------- User Content ---------------------------------------- */}

          <div>
            <Text
              label={t("privacy.terms4")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.t4")}</p>
          </div>

          {/* ----------------------------------------- Likes and Interactions ---------------------------------------- */}

          <div>
            <Text
              label={t("privacy.terms5")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.t5")}</p>
          </div>
        </div>

        {/* ----------------------------------------- terms-of-privacy"---------------------------------------- */}

        <div className="terms-of-privacy">
          <Text
            label={t("privacy.privacy_head")}
            weight={"bold"}
            lineheight={"lnormal"}
            size={"s20"}
            color={"black"}
          />

          {/* ----------------------------------------- Information We Collect---------------------------------------- */}

          <div>
            <Text
              label={t("privacy.privacy1")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.p1")}</p>
          </div>

          {/* ----------------------------------------- Sharing Your Information ---------------------------------------- */}

          <div>
            <Text
              label={t("privacy.privacy2")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.p2")}</p>
          </div>
          <div>
            <Text
              label={t("privacy.privacy3")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"black"}
            />
            <p>{t("privacy.p3")}</p>
          </div>
        </div>
        <Text
          label={t("privacy.privacy4")}
          weight={"bold"}
          lineheight={"lnormal"}
          size={"s14"}
          color={"purple"}
        />
      </div>
    </>
  );
};
export default Privacy;
