import { h, render } from "preact";
import "./style/index.scss";
import App from "./components/app";

// import "dayjs/locale/fr";
// import LocalizedFormat from "dayjs/plugin/localizedFormat";
// import dayjs from "dayjs";

// dayjs.extend(LocalizedFormat);
// dayjs.locale("fr");

const mountNode = document.getElementById("app")!;

render(<App />, mountNode);
