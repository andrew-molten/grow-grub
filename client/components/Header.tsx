import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router-dom'
// import { useGetUser } from '../hooks/useHooks'
import { useEffect, useState } from 'react'

interface Props {
  registered: boolean
}
export default function Header({ registered }: Props) {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()

  const location = useLocation()
  const [navigation, setNavigation] = useState([
    { name: 'Home', path: '/', current: false },
    { name: 'My Garden', path: '/my-garden', current: false },
    { name: 'My Tasks', path: '/my-tasks', current: false },
    { name: 'My Plants', path: '/my-plants', current: false },
  ])

  useEffect(() => {
    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: item.path === location.pathname,
    }))
    setNavigation(updatedNavigation)
  }, [])

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleLog = () => {
    if (isAuthenticated) logout()
    else loginWithRedirect()
  }
  return (
    <Disclosure as="nav" className="bg-white-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
                <DisclosurePanel as="ul" className="dropdown-menu">
                  {open &&
                    registered &&
                    navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </DisclosurePanel>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-9 w-auto"
                    src="/images/growgrub_logo.png"
                    alt="Grow-grub Ltd. logo"
                  />
                </div>
                {registered && (
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={classNames(
                            item.current
                              ? 'border-b-4 border-green-600 text-gray-700'
                              : 'hover:text-gray-700py-2 text-sm font-medium text-gray-500',
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            className={classNames(
                              focus ? 'bg-gray-100' : 'w-full text-left',
                              'block w-full px-4 py-2 text-left text-sm text-gray-700',
                            )}
                            onClick={handleLog}
                          >
                            {isAuthenticated ? 'Sign out' : 'Sign in'}
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel> */}
        </>
      )}
    </Disclosure>
  )
}
