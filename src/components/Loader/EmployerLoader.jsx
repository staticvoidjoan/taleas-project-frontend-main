import ContentLoader from "react-content-loader";
const EmployerLoader = () => (
  <ContentLoader
    speed={2}
    width={390}
    height={800}
    viewBox="0 390 600"
    backgroundColor="#cfe8f7"
    foregroundColor="#ecebeb"
  >
    <rect x="20" y="40" rx="10" ry="10" width="100" height="35" />
    <rect x="20" y="98" rx="24" ry="24" width="350" height="180" />
    <rect x="20" y="294" rx="24" ry="24" width="350" height="180" />
    <rect x="20" y="490" rx="24" ry="24" width="350" height="180" />
    <rect x="165" y="715" rx="10" ry="10" width="60" height="30" />
    <circle cx="100" cy="732" r="35" />
    <circle cx="290" cy="732" r="35" />
  </ContentLoader>
);

export default EmployerLoader
