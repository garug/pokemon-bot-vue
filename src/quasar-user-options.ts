import { Notify } from "quasar";
import iconSet from "quasar/icon-set/fontawesome-v5.js";
import lang from "quasar/lang/pt-BR.js";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";

// To be used on app.use(Quasar, { ... })
export default {
  config: {
    dark: true,
  },
  plugins: {
    Notify,
  },
  lang: lang,
  iconSet: iconSet,
};
