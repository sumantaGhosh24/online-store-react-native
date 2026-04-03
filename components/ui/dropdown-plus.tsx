import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {memo, useCallback} from "react";
import {TouchableOpacity} from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

interface DropdownPlusProps {
  text: string;
  href: string;
}

const DropdownPlus = memo(({text, href}: DropdownPlusProps) => {
  const router = useRouter();

  const handleCreate = useCallback(() => {
    router.push(href as any);
  }, [router, href]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity activeOpacity={0.7} style={{padding: 5}}>
          <Ionicons name="add" size={32} color={"#fff"} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item key="create" onSelect={handleCreate}>
            <DropdownMenu.ItemTitle>{text}</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
});

DropdownPlus.displayName = "DropdownPlus";

export default DropdownPlus;
