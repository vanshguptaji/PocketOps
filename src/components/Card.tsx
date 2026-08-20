import { View, StyleSheet, ViewProps } from "react-native";

type CardProps = ViewProps & {
  children: React.ReactNode;
};

const Card = ({ children, style, ...props }: CardProps) => {
  return (
    <View
      style={[styles.card, style]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,

    // Android
    elevation: 3,

    // iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Card;