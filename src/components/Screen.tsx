import { View, StyleSheet, ViewProps } from "react-native";

type ScreenProps = ViewProps & {
  children: React.ReactNode;
};

const Screen = ({ children, style, ...props }: ScreenProps) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
});

export default Screen;