import { StyleSheet, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CircularChart from "@/components/CircularChart";
import CategoryList from "@/components/CategoryList";
import Sizes from "@/utils/Sizes";
import services from "../../utils/services";
import { client } from "../../utils/KindeConfig";
import { supabase } from "../../utils/superbaseConfig";
import Colors from "@/utils/Colors";
import Header from "@/components/Header";
import { Category } from "@/types";

export default function HomeScreen() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const checkUserAuth = async () => {
    const result = await services.getData("login");

    if (result !== "true") {
      router.replace("/login");
    }

    const user = await client.getUserDetails();
    if (!user.email && !user.id) {
      router.replace("/login");
    }

    return user;
  };

  async function getCategories() {
    setLoading(true);
    const user = await checkUserAuth();
    if (!user?.email) {
      return;
    }

    let { data, error } = await supabase
      .from("category")
      .select("*,category_item(*)")
      .eq("created_by", user.email)
      .order("created_at", { ascending: false });

    if (data) {
      setCategoryList(data);
      setLoading(false);
    }

    if (error) {
      console.error(error);
    }
  }

  return (
    <View>
      <ParallaxScrollView refreshControl={getCategories} refreshing={loading}>
        <View style={styles.container}>
          <View>
            <Header />
            <CircularChart categorys={categoryList} />
            <View>
              <CategoryList categoryList={categoryList} />
            </View>
          </View>
        </View>
      </ParallaxScrollView>

      <Link href={"/addNewCategory"} style={styles.addNewBtn}>
        <FontAwesome6
          name="circle-plus"
          size={Sizes.XLG}
          color={Colors.PRIMARY}
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    height: "100%",
  },

  addNewBtn: {
    position: "absolute",
    right: Sizes.LG,
    bottom: 20,
    zIndex: 10,
    backgroundColor: Colors.WHITE,
  },
});
