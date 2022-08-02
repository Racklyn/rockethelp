import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

import { VStack, useColorModeValue, Button as ButtonNativeBase, Heading, Slide, Box, Modal, Image, Text } from 'native-base';
import { Alert } from 'react-native';


import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

export function Register() {

	const [isLoading, setIsLoading] = useState(false)
	const [patrimony, setPatrimony] = useState('')
	const [description, setDescription] = useState('')
	const [imageUrl, setImageUrl] = useState('')

	const [isPhotoMenuOpened, setIsPhotoMenuOpened] = useState(false)

	const navigation = useNavigation()

	const photoBtnBg = useColorModeValue("gray.600", "gray.50")
	const photoBtnBorderColor = useColorModeValue("gray.300", "gray.200")
	const photoBtnBorder2Color = useColorModeValue("green.500", "primary.700")

	function takePhotoFromCamera() {
		ImagePicker.openCamera({
			width: 300,
			height: 300,
			cropping: true,
			compressImageQuality: 0.7
		}).then(image => {
			console.log(image);
			setImageUrl(image.path)
		}).catch(e => {
			console.log(e)
		});
	}

	function choosePhotoFromLibrary() {
		ImagePicker.openPicker({
			width: 300,
			height: 300,
			cropping: true,
			compressImageQuality: 0.7
		}).then(image => {
			console.log(image);
			setImageUrl(image.path)
		}).catch(e => {
			console.log(e)
		});
	}

	function handleNewOrderResgister() {
		if (!patrimony || !description) {
			return Alert.alert('Registrar', 'Preencha todos os campos.')
		}

		setIsLoading(true)

		firestore().collection('orders').add({
			patrimony,
			description,
			status: 'open',
			created_at: firestore.FieldValue.serverTimestamp()
		})
			.then(() => {
				Alert.alert('Solicitação', 'Solicitação registrada com sucesso!')
				navigation.goBack()
			})
			.catch(error => {
				console.log(error)
				setIsLoading(false)
				return Alert.alert('Solicitação', 'Não foi possível registrar o pedido.')
			})

	}

	return (
		<>
			<VStack flex={1} p={6} bg={useColorModeValue("gray.600", "gray.50")} >
				<Header title='Solicitação' />
				{/* TODO: Maybe, add a scrollView here */}
				<Input
					placeholder="Número do patrimônio"
					mt={4}
					onChangeText={setPatrimony}
				/>

				<Input
					placeholder="Descrição do problema"
					flex={1}
					mt={5}
					onChangeText={setDescription}
					multiline
					textAlignVertical="top"
				/>



				{/* TODO: Make a condition for hinding buttons and showing the image */}

				{
					imageUrl.length !== 0 ?
						<>
							<Image
								mt={4}
								resizeMode='contain'
								flex={1}
								source={{
									uri: imageUrl
								}}
								alt="Não foi possível carregar a imagem"
								
							/>
							<ButtonNativeBase width="20" onPress={() => setImageUrl('')}>
								X
							</ButtonNativeBase>
						</>

						:
						<>
							<ButtonNativeBase
								bg={photoBtnBg}
								h={20}
								borderColor={photoBtnBorderColor}
								borderWidth={2}
								borderStyle="dashed"
								mt={2}
								fontSize="sm"
								rounded="sm"
								_pressed={{
									borderColor: photoBtnBorder2Color,
									bg: photoBtnBg
								}}
								onPress={takePhotoFromCamera}    //() => setIsPhotoMenuOpened(true)
							>
								<Heading color="gray.300" fontSize="sm"> ADICIONAR FOTO </Heading>
							</ButtonNativeBase>

							{/* TODO: Delete one of this buttons and create modal menu */}
							<ButtonNativeBase
								bg={photoBtnBg}
								h={20}
								borderColor={photoBtnBorderColor}
								borderWidth={2}
								borderStyle="dashed"
								mt={2}
								fontSize="sm"
								rounded="sm"
								_pressed={{
									borderColor: photoBtnBorder2Color,
									bg: photoBtnBg
								}}
								onPress={choosePhotoFromLibrary}
							>
								<Heading color="gray.300" fontSize="sm"> ESCOLHER DA BIBLIOTECA </Heading>
							</ButtonNativeBase>

						</>
				}


				<Button
					title="Cadastrar"
					mt={6}
					isLoading={isLoading}
					onPress={handleNewOrderResgister}
				/>

				{/* <Slide in={isPhotoMenuOpened} placement="bottom" flex={1} justifyContent="space-between">
				<Box bg="teal.500">
					Olá
				</Box>
			</Slide> */}

			</VStack>

			{/* <Modal isOpen={isPhotoMenuOpened} onClose={() => setIsPhotoMenuOpened(false)}>
			<Modal.Content></Modal.Content>

		</Modal> */}

		</>
	);
}