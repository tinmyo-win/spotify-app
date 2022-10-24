import { fromatDuration } from "../util";
import { StyledTrackList } from "../styles";

const TrackList = ({ tracks }) => {
  return (
    <>
      {tracks && tracks.length ? (
        <StyledTrackList>
          {tracks.map((track, i) => (
            <li className="track__item" key={i}>
              <div className="track__item__num">{i + 1}</div>
              <div className="track__item-title-group">
                {track.album.images.length && track.album.images[2] && (
                  <div className="track__item__img">
                    <img src={track.album.images[2].url} alt={track.name} />
                  </div>
                )}
                <div className="track__time_name-artist">
                  <div className="track__item__name overflow-ellipsis">
                    {track.name}
                  </div>
                  <div className="track__item__artist overflow-ellipsis">
                    {track.artists.map((artist, i) => (
                      <span key={i}>
                        {artist.name} {i !== track.artists.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="track__item__album overflow-ellipsis">
                  {track.album.name}
                </div>
                <div className="track__item__duration">
                  {fromatDuration(track.duration_ms)}
                </div>
              </div>
            </li>
          ))}
        </StyledTrackList>
      ) : (
        <p className="empty-notice">No tracks available</p>
      )}
    </>
  );
};

export default TrackList;
