import React, { Fragment } from 'react'
import { SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { Icon } from 'native-base';
import { Formik } from 'formik'
import * as Yup from 'yup'
import { styles } from '../common/styles'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import ScreenHeader from '../components/ScreenHeader'
import Delete from '../components/Delete'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, addkhata, editkhata, deletekhata } from '../common/Constant'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  business: Yup.string()
    .label('Business')
    .required()
    .min(2, 'Must have at least 2 characters')
})

const validationSchemaPersonal = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
})

export default class AddKhata extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      khataTypeID: this.props.navigation.getParam('typeid','default'),
      khataname: this.props.navigation.getParam('khataname','default'),
      businessname: this.props.navigation.getParam('businessname','default'),
      mode: this.props.navigation.getParam('mode','default'),
      loading:false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <ScreenHeader mode={params.screenEdit} title={'Khata'} /> : <React.Fragment></React.Fragment>,
      headerRight: params && params.screenEdit === 'edit' ? <Delete action={params.deleteButton} mode={params.screenEdit} /> : <React.Fragment></React.Fragment>,
      headerBackTitleVisible: false,
      headerBackTitle: null,
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({ deleteButton: this._deleteButton });
    this.props.navigation.setParams({
      screenEdit:this.state.mode,
    })
  }

  _deleteButton = async (value) => {
    this.addKhata('delete');
  }

  displayStorage = async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  }

  addKhata = async (values) => {
    console.log (values)

    let self = this;
    let apiurl
    let apimethod
    const userToken = await AsyncStorage.getItem('userId');
    const mode = this.props.navigation.getParam('mode','default')
    apiurl = mode === 'edit' ? editkhata : addkhata
    apimethod = mode === 'edit' ? 'PUT' : 'POST'
    const getKhataId = await AsyncStorage.getItem('KhataId');
    if (values === 'delete') { apiurl = deletekhata, apimethod = 'POST'}
    const addBody = {
      userid:userToken,
      name: values.name,
      businessname: this.state.khataTypeID === "2" ? values.business : '',
      type:this.state.khataTypeID,
      khataid:mode === 'edit' ? getKhataId : ''
    }
    const deleteBody = {
      userid:userToken,
      khataid:getKhataId
    }
    const body = values === 'delete' ?  deleteBody : addBody

    
    //console.log (postBody)
    this.setState({
      loading: true,
    });
    console.log (userToken,apiurl,body )
    api(body, baseurl + apiurl, apimethod, null).then(async (response)=>{
      if (response.data.success === 1 && response.data.dashboard !== 0) {
        console.log(response);
        await AsyncStorage.setItem('khataName', response.data.name);
        await AsyncStorage.setItem('businessName', response.data.businessname);
        await AsyncStorage.setItem('TypeId', response.data.type);
        await AsyncStorage.setItem('KhataId', response.data.id);
        //self.props.navigation.navigate('Dashboard')
        self.props.navigation.navigate('Dashboard', {  
          mode: 'edit',
        })
        this.setState({
          loading:false
        });
      }
      else if (response.data.dashboard === 0) {
        this.props.navigation.navigate('Home');
      }
      else {
        alert (response.data.message)
      }
      }).catch(function (error) {
      console.log(error);
    });
  }

  handleSubmit = async values  => {
    let self = this;
    //console.log (values)
    if (this.state.khataTypeID === "2" ? values.name.length > 0 && values.business.length > 0 : values.name.length > 0) {
      self.addKhata(values);
    }
  }

  render() {
    const { khataTypeID, khataname, businessname, mode, loading } = this.state
    //this.displayStorage();
    //console.log ('khatatype',khatatype)
    //console.log ('khataTypeID',khataTypeID)
    return (
      <React.Fragment>
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: mode === 'edit' ? khataname : '',
            business: mode === 'edit' ? businessname : '',
          }}
          onSubmit={values => {
            this.handleSubmit(values)
          }}
          validationSchema={khataTypeID !== "2" ? validationSchemaPersonal : validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting
          }) => (
            <Fragment>
              <View style={{marginLeft:25, marginTop:25}}>
                <Text style={{fontWeight:'bold',paddingBottom:5,fontSize:28}}>Few Details first,</Text>
                <Text style={{paddingBottom:5,fontSize:28 }}>we need your business</Text>
                <Text style={{fontSize:28 }}>khata book name</Text>
              </View>
              <View style={styles.boxcontainer}>
                <View style={khataTypeID === "2" ? styles.inputDivider : {paddingTop:15}}>
                    <FormInput
                    name='name'
                    value={values.name}
                    onChangeText={handleChange('name')}
                    placeholder='Name of your Khata'
                    iconName='md-person'
                    iconColor='#2C384A'
                    onBlur={handleBlur('name')}
                    //autoFocus
                    />
                    <ErrorMessage errorValue={touched.name && errors.name} />
                </View>
                {khataTypeID === "2" ? 
              <React.Fragment>
                <View style={{paddingTop:15,position:'relative'}}>
                <FormInput
                  name='business'
                  value={values.business}
                  onChangeText={handleChange('business')}
                  placeholder='Enter Business Name'
                  iconName='md-person'
                  iconColor='#2C384A'
                  onBlur={handleBlur('business')}
                  //autoFocus
                />
                <ErrorMessage errorValue={touched.business && errors.business} />
                </View>
              </React.Fragment>
              : <React.Fragment></React.Fragment>
              }
              </View>  
              
              <View style={styles.buttonContainer}>
                {/*<View style={{flexDirection:'row', backgroundColor:'#687DFC', justifyContent:'center', padding:20, borderRadius:5}}>
                <Text style={{color:'#fff', paddingRight:10}}>Save</Text>
                <Icon type="FontAwesome" name="arrow-right" style={{color:'#fff', fontSize:14}}/>
                </View>*/}
                <FormButton
                  buttonType='outline'
                  onPress={handleSubmit}
                  title='Save'
                  textColor= '#ffffff'
                  buttonColor='#687DFC'
                  icon={true}
                  iconType='FontAwesome'
                  iconName='arrow-right'
                  disabled={!isValid || isSubmitting}
                  //loading={isSubmitting}
                />
                
              </View>
            </Fragment>
          )}
        </Formik>
      </SafeAreaView>
      {loading && <Loader />}
      </React.Fragment>
    )
  }
}
