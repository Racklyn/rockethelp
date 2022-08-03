import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';


import { VStack, useColorModeValue, Button as ButtonNativeBase, Heading, Modal, Text, ScrollView, Circle, Pressable, useTheme } from 'native-base';
import { Alert, ImageBackground } from 'react-native';
import { X, Image as ImageIcon } from 'phosphor-react-native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

export function Register() {

	const [isLoading, setIsLoading] = useState(false)
	const [patrimony, setPatrimony] = useState('')
	const [description, setDescription] = useState('')
	const [image, setimage] = useState(null)

	const { colors } = useTheme()

	const [isPhotoMenuOpened, setIsPhotoMenuOpened] = useState(false)

	const navigation = useNavigation()

	const photoBtnBg = useColorModeValue("gray.600", "gray.50")
	const photoBtnBorderColor = useColorModeValue("gray.300", "gray.200")
	const photoBtnBorder2Color = useColorModeValue("green.500", "primary.700")
	const modalBtnColor = useColorModeValue("primary.800", "green.500")

	function takePhotoFromCamera() {
		ImagePicker.openCamera({
			width: 600,
			height: 600,
			cropping: true,
			compressImageQuality: 0.7
		}).then(image => {
			console.log(image);
			setimage(image.path)
		}).catch(e => {
			console.log(e)
		});
	}

	function choosePhotoFromLibrary() {
		ImagePicker.openPicker({
			width: 600,
			height: 600,
			cropping: true,
			compressImageQuality: 0.7
		}).then(image => {
			console.log(image);
			setimage(image.path)
		}).catch(e => {
			console.log(e)
		});
	}

	async function handleNewOrderResgister() {
		if (!patrimony || !description) {
			return Alert.alert('Registrar', 'Preencha todos os campos.')
		}

		setIsLoading(true)

		const uploadUri = image
		let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

		// Adding timestamp to File name
		const extension = fileName.split('.').pop()
		const name = fileName.split('.').slice(0, -1).join('.')
		fileName = name + '_' + Date.now() + '.' + extension

		let hasUploadedImg = false
		try {
			await storage().ref(fileName).putFile(uploadUri)
			hasUploadedImg = true
		} catch (error) {
			console.log(error)
		}

		firestore().collection('orders').add({
			patrimony,
			description,
			status: 'open',
			created_at: firestore.FieldValue.serverTimestamp(),
			image: hasUploadedImg && await storage().ref(fileName).getDownloadURL()
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


				<ScrollView showsVerticalScrollIndicator={false}>
				
					<Input
						placeholder="Número do patrimônio"
						mt={4}
						isDisabled={isLoading}
						onChangeText={setPatrimony}
					/>

					<Input
						placeholder="Descrição do problema"
						mt={5}
						maxHeight="250"
						minHeight="250"
						isDisabled={isLoading}
						onChangeText={setDescription}
						multiline
						textAlignVertical="top"

					/>

					{
						image ?
							
							<ImageBackground
								style={{
									marginTop: 10,
									marginLeft: 4, 
									flex: 1,
									aspectRatio: 1,
									alignItems: 'flex-end',
									padding: 10
								}}
								resizeMode='contain'
								source={{ uri: image }}
							>
								<Pressable isDisabled={isLoading} onPress={() => {setimage(null)}} _pressed={{
									opacity: 0.7
								}}>
									<Circle bg="gray.300" p={1}>
										<X size={16} color="white" />
									</Circle>
								</Pressable>
							</ImageBackground>
						

							:
							
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
								onPress={() => setIsPhotoMenuOpened(true)}
							>
								<Heading color="gray.300" fontSize="sm"> + IMAGEM DO EQUIPAMENTO </Heading>
							</ButtonNativeBase>

			
					}

				</ScrollView>


				<Button
					title="Cadastrar"
					mt={6}
					isLoading={isLoading}
					onPress={handleNewOrderResgister}
				/>

				

			</VStack>



			<Modal isOpen={isPhotoMenuOpened} onClose={() => setIsPhotoMenuOpened(false)}>
			<Modal.Content
				bg={photoBtnBg}
			>
				<Modal.CloseButton />
				<Modal.Header bg={photoBtnBg} alignItems="center" flexDirection="row">
					<ImageIcon size={20} color={colors.gray[300]} />
					<Text color="gray.300" bold ml={2}>
						IMAGEM DO EQUIPAMENTO 
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Button
						title="Tirar foto"
						mt={6}
						onPress={() => {
							setIsPhotoMenuOpened(false)
							takePhotoFromCamera()
						}}
						background={modalBtnColor}
						_pressed={{
							opacity: 0.7
						}}
					/>
					<Button
						title="Escolher da galeria"
						mt={6}
						onPress={ () => {
							setIsPhotoMenuOpened(false)
							choosePhotoFromLibrary()
						}}
						background={modalBtnColor}
						_pressed={{
							opacity: 0.7
						}}
					/>
					
				</Modal.Body>
			</Modal.Content>

			</Modal> 
		</>

	);
}