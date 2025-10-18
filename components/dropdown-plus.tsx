import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

interface DropdownPlusProps {
  text: string;
  href: string;
}

const DropdownPlus = ({text, href}: DropdownPlusProps) => {
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
          <Ionicons name="add" size={32} color={"#fff"} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            key="create"
            onSelect={() => router.push(href as any)}
          >
            <DropdownMenu.ItemTitle>{text}</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Item
          key="dashboard"
          onSelect={() => router.push("/dashboard")}
        >
          <DropdownMenu.ItemTitle>Dashboard</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DropdownPlus;
