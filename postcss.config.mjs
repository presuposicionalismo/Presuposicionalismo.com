import OpenProps from "open-props";
import ColorsHSL from "open-props/src/colors-hsl";
import postcssJitProps from "postcss-jit-props";
import postcssNesting from "postcss-nesting";
import postcssCustomMedia from "postcss-custom-media";

export default {
    plugins: [
        postcssNesting(),
        postcssCustomMedia(),
        postcssJitProps({ ...OpenProps, ...ColorsHSL }),
    ],
};
