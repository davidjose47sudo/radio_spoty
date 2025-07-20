import { supabase } from './supabase'
import type { 
  Profile, 
  Artist, 
  Album, 
  Song, 
  Playlist, 
  PlaylistTrack,
  Jam, 
  RadioStation, 
  RadioStationSong,
  Subscription,
  UserPreferences,
  AIRadioJob,
  WeeklyAIRadio
} from './supabase'

// =============================================
// PROFILE FUNCTIONS
// =============================================
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

export async function incrementPlayCount(userId: string) {
  const { error } = await supabase.rpc('increment_play_count', {
    user_id_param: userId
  })

  return { error }
}

// =============================================
// ARTIST FUNCTIONS
// =============================================
export async function getArtists() {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('name')

  return { data, error }
}

export async function getArtist(id: string) {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

export async function createArtist(artist: Omit<Artist, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('artists')
    .insert(artist)
    .select()
    .single()

  return { data, error }
}

export async function updateArtist(id: string, updates: Partial<Artist>) {
  const { data, error } = await supabase
    .from('artists')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteArtist(id: string) {
  const { error } = await supabase
    .from('artists')
    .delete()
    .eq('id', id)

  return { error }
}

// =============================================
// ALBUM FUNCTIONS
// =============================================
export async function getAlbums() {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      artist:artists(*)
    `)
    .order('title')

  return { data, error }
}

export async function getAlbum(id: string) {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      artist:artists(*)
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export async function createAlbum(album: Omit<Album, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('albums')
    .insert(album)
    .select(`
      *,
      artist:artists(*)
    `)
    .single()

  return { data, error }
}

// =============================================
// SONG FUNCTIONS
// =============================================
export async function getSongs() {
  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      artist:artists(*),
      album:albums(*)
    `)
    .order('title')

  return { data, error }
}

export async function getSong(id: string) {
  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      artist:artists(*),
      album:albums(*)
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export async function createSong(song: Omit<Song, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('songs')
    .insert(song)
    .select(`
      *,
      artist:artists(*),
      album:albums(*)
    `)
    .single()

  return { data, error }
}

export async function updateSong(id: string, updates: Partial<Song>) {
  const { data, error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      artist:artists(*),
      album:albums(*)
    `)
    .single()

  return { data, error }
}

export async function deleteSong(id: string) {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id)

  return { error }
}

// =============================================
// PLAYLIST FUNCTIONS
// =============================================
export async function getUserPlaylists(userId: string) {
  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getPlaylist(id: string) {
  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      user:profiles(*),
      playlist_tracks(
        *,
        song:songs(
          *,
          artist:artists(*),
          album:albums(*)
        )
      )
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export async function createPlaylist(playlist: Omit<Playlist, 'id' | 'tracks_count' | 'total_duration' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('playlists')
    .insert(playlist)
    .select()
    .single()

  return { data, error }
}

export async function addSongToPlaylist(playlistId: string, songId: string) {
  const { data, error } = await supabase
    .from('playlist_tracks')
    .insert({
      playlist_id: playlistId,
      song_id: songId
    })
    .select()
    .single()

  return { data, error }
}

export async function removeSongFromPlaylist(playlistId: string, songId: string) {
  const { error } = await supabase
    .from('playlist_tracks')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('song_id', songId)

  return { error }
}

// =============================================
// JAMS FUNCTIONS
// =============================================
export async function createJam(jam: Omit<Jam, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('jams')
    .insert(jam)
    .select(`
      *,
      host:profiles(*),
      current_song:songs(
        *,
        artist:artists(*)
      )
    `)
    .single()

  return { data, error }
}

export async function getJam(inviteCode: string) {
  const { data, error } = await supabase
    .from('jams')
    .select(`
      *,
      host:profiles(*),
      current_song:songs(
        *,
        artist:artists(*)
      )
    `)
    .eq('invite_code', inviteCode)
    .eq('is_active', true)
    .single()

  return { data, error }
}

export async function getUserJams(userId: string) {
  const { data, error } = await supabase
    .from('jams')
    .select(`
      *,
      host:profiles(*),
      current_song:songs(
        *,
        artist:artists(*)
      )
    `)
    .eq('host_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// =============================================
// RADIO STATION FUNCTIONS
// =============================================
export async function getRadioStations() {
  const { data, error } = await supabase
    .from('radio_stations')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return { data, error }
}

export async function getAIRadioStations() {
  const { data, error } = await supabase
    .from('radio_stations')
    .select('*')
    .eq('is_ai_generated', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function createRadioStation(station: Omit<RadioStation, 'id' | 'play_count' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('radio_stations')
    .insert(station)
    .select()
    .single()

  return { data, error }
}

export async function getRadioStationWithSongs(id: string) {
  const { data, error } = await supabase
    .from('radio_stations')
    .select(`
      *,
      radio_station_songs(
        *,
        song:songs(
          *,
          artist:artists(*),
          album:albums(*)
        )
      )
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export async function addSongToRadioStation(radioStationId: string, songId: string, orderIndex?: number) {
  const { data, error } = await supabase
    .from('radio_station_songs')
    .insert({
      radio_station_id: radioStationId,
      song_id: songId,
      order_index: orderIndex || 0
    })
    .select()
    .single()

  return { data, error }
}

// =============================================
// AI RADIO FUNCTIONS
// =============================================
export async function createAIRadioJob(job: Omit<AIRadioJob, 'id' | 'status' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('ai_radio_jobs')
    .insert({
      ...job,
      status: 'pending'
    })
    .select()
    .single()

  return { data, error }
}

export async function updateAIRadioJob(id: string, updates: Partial<AIRadioJob>) {
  const { data, error } = await supabase
    .from('ai_radio_jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function getPendingAIRadioJobs() {
  const { data, error } = await supabase
    .from('ai_radio_jobs')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('status', 'pending')
    .order('created_at')

  return { data, error }
}

export async function getUserWeeklyRadio(userId: string, weekStartDate?: string) {
  const weekStart = weekStartDate || new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('weekly_ai_radios')
    .select(`
      *,
      user:profiles(*),
      radio_station:radio_stations(*)
    `)
    .eq('user_id', userId)
    .eq('week_start_date', weekStart)
    .single()

  return { data, error }
}

export async function generateWeeklyAIRadios() {
  const { error } = await supabase.rpc('generate_weekly_ai_radio')
  return { error }
}

// =============================================
// SUBSCRIPTION FUNCTIONS
// =============================================
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  return { data, error }
}

export async function createSubscription(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(subscription)
    .select()
    .single()

  return { data, error }
}

export async function updateSubscription(id: string, updates: Partial<Subscription>) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
