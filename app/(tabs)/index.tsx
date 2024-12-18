import { Text, View, StyleSheet } from "react-native";
import { useUser } from "@/context/userContext";

export default function Index() {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>반갑습니다! {user?.user_name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
