import { Center, Spinner, useColorModeValue } from "native-base";

export function Loading(){
    return (
        <Center flex={1} bg={useColorModeValue("gray.700", "gray.50")}>
            <Spinner color="secondary.700" size="lg" />
        </Center>
    )
}