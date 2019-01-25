import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import Repo from './Components/Repo';
import NewRepoModal from './Components/NewRepo'

export default class App extends Component{
  state = {
    modalVisible: false,
    repos: [],
  };

  async componentDidMount(){
    const repos = JSON.parse(await AsyncStorage.getItem('@Minicurso:repositories'));
    this.setState({repos});
  }

  _addRepository = async (newRepoText) => {
    let repo = await fetch('https://api.github.com/repos/' + newRepoText)
                      .then(rep => rep.json());

    console.log(repo);

    let repository = {
      id: repo.id,
      thumbnail: repo.owner.avatar_url,
      title: repo.name,
      author: repo.owner.login,
    }

    this.setState({
      modalVisible: false,
      repos: [
        ...this.state.repos,
        repository,
      ],
    });

    await AsyncStorage.setItem('@Minicurso:repositories', JSON.stringify('this.state.repos'));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Minicurso GoNative</Text>
          <TouchableOpacity onPress={() => {this.setState({modalVisible: true})}}>
            <Text style={styles.headerButton}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.repoList} keyboardShouldPersistTaps={'handled'}>
          { this.state.repos.map(repo =>
            <Repo key={repo.id} data={repo}/>
          ) }
          <NewRepoModal
            onAdd={this._addRepository}
            onCancel={() => this.setState({ modalVisible: false })}
            visible={this.state.modalVisible}/>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  header:{
    height: (Platform.OS === 'ios') ? 70 : 50,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30
  },
  headerButton:{
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerText:{
    fontSize: 16,
    fontWeight: 'bold'
  },
  repoList: {
    padding: 20,
  },

});
