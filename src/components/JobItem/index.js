import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobItem = props => {
  const {details} = props
  const {
    employmentType,
    companyLogoUrl,
    title,
    rating,
    location,
    packagePerAnnum,
    jobDescription,
    id,
  } = details

  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="job-item">
        <div className="rating-log-cont">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h3 className="job-title">{title}</h3>
            <p className="rating-para">
              <BsFillStarFill className="rating-star" />
              {rating}
            </p>
          </div>
        </div>
        <div className="location-type-package-cont">
          <div className="location-type-cont">
            <div className="location-cont">
              <MdLocationOn className="location-icon" />
              <p>{location}</p>
            </div>
            <div className="location-cont">
              <BsFillBriefcaseFill className="location-icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <h1 className="description">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
