// import { useState } from 'react'
import { useHooks } from '../hooks/useHooks'
import DropDownAutoFilter from './DropDownAutoFilter'
import { Plant } from '../../models/growGrub'

interface Props {
  handlePlantSelect: (option: string) => void
  plotSunLevel: undefined | string
}

function PlotPlantSuggestionDropDown({
  handlePlantSelect,
  plotSunLevel,
}: Props) {
  const hooks = useHooks()
  const plantsQuery = hooks.useGetPlants()
  const user = hooks.useGetUser()

  let userSummerStartMonth = ''
  if (user.data) {
    userSummerStartMonth = user.data.summerStarts
  }

  const dateNow = new Date()
  const currentMonthIndex = dateNow.getMonth()

  // - ask gemeni when summer starts for the users location then do maths
  const months = [
    'january',
    'febuary',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]

  // figure out current season
  const seasons = [
    'early-summer',
    'summer',
    'late-summer',
    'early-autumn',
    'autumn',
    'late-autumn',
    'early-winter',
    'winter',
    'late-winter',
    'early-spring',
    'spring',
    'late-spring',
  ]

  // to figure out what the current season is we need to take the index of the users summer month, and then move it
  const indexOfSummerMonth = months.findIndex(
    (month) => month === userSummerStartMonth.toLowerCase(),
  )
  const numMonthsSinceEarlySummer = getMonthsSinceEarlySummer(
    indexOfSummerMonth,
    currentMonthIndex,
  )
  function getMonthsSinceEarlySummer(
    summerStartIndex: number,
    currMonthIndex: number,
  ) {
    if (currMonthIndex < summerStartIndex) {
      return currMonthIndex + 1 + (11 - summerStartIndex)
    }
    if (currMonthIndex === summerStartIndex) {
      return 0
    }
    if (currMonthIndex > summerStartIndex) {
      return currMonthIndex - summerStartIndex
    }
  }

  const currentSeason = seasons[numMonthsSinceEarlySummer!]
  const lastSeasonPhase = seasons[numMonthsSinceEarlySummer! - 1]
    ? seasons[numMonthsSinceEarlySummer! - 1]
    : seasons[11]
  console.log(lastSeasonPhase)
  // FILTER
  let plantSuggestions: string[] = []
  let otherPlantSuggestions: string[] = []
  if (plantsQuery.data) {
    const filteredBySun = plantsQuery.data.filter(
      (plant: Plant) =>
        plotSunLevel === undefined ||
        plant.sun_level.toLowerCase().includes(plotSunLevel) ||
        (plant.sun_level.toLowerCase().includes('partial-shade') &&
          plotSunLevel === 'part-sun') ||
        (plant.sun_level.toLowerCase().includes('partial-sun') &&
          plotSunLevel === 'part-sun'),
    )
    const filteredBySeason = filteredBySun.filter(
      (plant) =>
        plant.planting_starts.toLowerCase() === 'year-round' ||
        plant.planting_starts.toLowerCase().includes(currentSeason) ||
        plant.planting_starts
          .toLowerCase()
          .includes(currentSeason.split('-').join(' ')) ||
        plant.planting_starts.toLowerCase().includes(lastSeasonPhase),
    )
    plantSuggestions = filteredBySeason.map((plant: Plant) => plant.name)
    otherPlantSuggestions = plantsQuery.data
      .filter((plant) => !plantSuggestions.includes(plant.name))
      .map((plant: Plant) => plant.name)
  }

  return (
    <>
      <p>Recommended plants:</p>
      <DropDownAutoFilter
        options={plantSuggestions}
        onSelect={handlePlantSelect}
        containerClass={
          'container absolute w-full border-b-[1px] border-t-[1px]  border-l-[1px] border-r-[1px] border-black bg-white rounded'
        }
      />
      <p>Other plants:</p>
      <DropDownAutoFilter
        options={otherPlantSuggestions}
        onSelect={handlePlantSelect}
        containerClass={
          'container absolute w-full border-b-[1px] border-t-[1px]  border-l-[1px] border-r-[1px] border-black bg-white rounded'
        }
      />
    </>
  )
}

// Possibly add filter for if the plants are in the users desired plants

export default PlotPlantSuggestionDropDown
