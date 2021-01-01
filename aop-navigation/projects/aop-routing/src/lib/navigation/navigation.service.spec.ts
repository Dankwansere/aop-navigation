import { Router } from '@angular/router';
import { GoodProxy, mockFunction } from '../../mock/test-data';
import { AopConfig, NavAux, RouteTransform } from '../model/models';
import { prepareNavObject } from './navigation-helper';
import { NavigationService } from './navigation.service';
import { ProxyNavigationService } from './proxy-navigation.service';
import { RouteHelper } from './router-helper';


describe('NavigationService', () => {
    let mockRouter, mockLocation, proxyNavigationService, navigationService: NavigationService;

    beforeEach(() => {
        proxyNavigationService = new ProxyNavigationService();
        mockRouter = jasmine.createSpyObj('mockRouter', ['navigate']);
        mockLocation = jasmine.createSpyObj('mockLocation', ['back']);
        navigationService = new NavigationService(mockRouter, mockLocation);
        RouteHelper.useExperimentalFeatures = false;
    });

    describe('#constructor', () => {
        it(`should set useExperimentalFeatures property of RouterHelper to passed in config`, () => {
            const config = new AopConfig();
            config.expirementNav = true;
            spyOn(RouteHelper, 'useExperimentalFeatures');
            navigationService = new NavigationService(mockRouter, mockLocation, undefined, config);
            expect(RouteHelper.useExperimentalFeatures).toBe(true);
        });
    });

    describe('#goToNextPage', () => {
        it('should call goToNextPage method of passed in proxy service', () => {
            const goodProxy = new GoodProxy();
            const navigationService2 = new NavigationService(mockRouter, mockLocation, goodProxy);
            const navAux = new NavAux('aop-page');
            spyOn(goodProxy, 'goToNextPage');
            NavigationService.goToNextPage(navAux);
            expect(goodProxy.goToNextPage).toHaveBeenCalled();
        });

        it(`should call executePreProcessLogic method if passed
         NavAux instance preprocess property is set`, () => {
            const navAux = new NavAux('aop-page', undefined, mockFunction);
            spyOn(NavigationService, 'executePreProcessLogic');
            NavigationService.goToNextPage(navAux);
            expect(NavigationService.executePreProcessLogic).toHaveBeenCalledWith(navAux.preprocess, navAux.param);
        });

        it(`should call modifyRouteTable method of RouterHelper if isAopNavObj method returns true`, () => {
            RouteHelper.useExperimentalFeatures = true;
            const routeTransform: RouteTransform = {
                path: 'Test3',
                component: '' as any
               };
            const mockObj = {routeTransform};
            spyOn(RouteHelper, 'modifyRouteTable');
            const result = prepareNavObject(mockObj);
            NavigationService.goToNextPage(result);
            expect(RouteHelper.modifyRouteTable).toHaveBeenCalledWith(mockRouter, result.routeTransform);
       });

       it(`should call executeImperativeNavigation method if isAopNavObj method returns true`, () => {
        RouteHelper.useExperimentalFeatures = true;
        const routeTransform: RouteTransform = {
            path: 'Test3',
            component: '' as any
           };
        const mockObj = {routeTransform};
        spyOn(RouteHelper, 'modifyRouteTable');
        spyOn(NavigationService, 'executeImperativeNavigation');
        const result = prepareNavObject(mockObj);
        NavigationService.goToNextPage(result);
        expect(NavigationService.executeImperativeNavigation).toHaveBeenCalledWith(result);
        });

        it(`should call resetRouterConfig method of RouterHelper if isAopNavObj method returns true`, () => {
            RouteHelper.useExperimentalFeatures = true;
            const routeTransform: RouteTransform = {
                path: 'Test3',
                component: '' as any
               };
            const mockObj = {routeTransform};
            spyOn(RouteHelper, 'modifyRouteTable');
            spyOn(NavigationService, 'executeImperativeNavigation');
            spyOn(RouteHelper, 'resetRouterConfig');
            const result = prepareNavObject(mockObj);
            NavigationService.goToNextPage(result);
            expect(RouteHelper.resetRouterConfig).toHaveBeenCalledWith(mockRouter);
        });

        it(`should call executeImperativeNavigation method if isAopNavObj method returns false`, () => {
            spyOn(NavigationService, 'executeImperativeNavigation');
            const result = prepareNavObject(undefined, 'aop-navigation');
            NavigationService.goToNextPage(result);
            expect(NavigationService.executeImperativeNavigation).toHaveBeenCalledWith(result);
        });

     });

    describe('#goToPreviousPage', () => {
        it('should call goToPreviousPage method of passed in proxy service', () => {
            const goodProxy = new GoodProxy();
            const navigationService2 = new NavigationService(mockRouter, mockLocation, goodProxy);
            const navAux = new NavAux('aop-page');
            spyOn(goodProxy, 'goToPreviousPage');
            NavigationService.goToPreviousPage(navAux);
            expect(goodProxy.goToPreviousPage).toHaveBeenCalledWith(navAux);
        });

        it(`should call executePreProcessLogic method if passed NavAux instance preprocess property is set`, () => {
           const navAux = new NavAux('aop-page', undefined, mockFunction);
           spyOn(NavigationService, 'executePreProcessLogic');
           NavigationService.goToPreviousPage(navAux);
           expect(NavigationService.executePreProcessLogic).toHaveBeenCalledWith(navAux.preprocess, navAux.param);
       });

        it(`should call back method of location obj`, () => {
        const navAux = new NavAux();
        NavigationService.goToPreviousPage(navAux);
        expect(mockLocation.back).toHaveBeenCalled();
         });

        it(`should throw error if exception thrown trying to call back method of location object`, () => {
        mockLocation.back.and.throwError('unit-test-error');
        const navAux = new NavAux();
        spyOn(console, 'error');
        expect(function () {
            NavigationService.goToPreviousPage(navAux);
          }).toThrow();
        });
    });

    describe('#goToState', () => {
        it('should call goToPreviousPage method of passed in proxy service', () => {
            const goodProxy = new GoodProxy();
            const navigationService2 = new NavigationService(mockRouter, mockLocation, goodProxy);
            const navAux = new NavAux(-1);
            spyOn(goodProxy, 'goToState');
            NavigationService.goToState(navAux);
            expect(goodProxy.goToState).toHaveBeenCalledWith(navAux);
        });

        it(`should call executePreProcessLogic method if passed NavAux instance preprocess property is set`, () => {
           const navAux = new NavAux(-1, undefined, mockFunction);
           spyOn(NavigationService, 'executePreProcessLogic');
           NavigationService.goToState(navAux);
           expect(NavigationService.executePreProcessLogic).toHaveBeenCalledWith(navAux.preprocess, navAux.param);
       });

       it(`should call go method of history obj, if destinationPage property of navAux is a number`, () => {
        const navAux = new NavAux(-1);
        spyOn(history, 'go');
        NavigationService.goToState(navAux);
        expect(history.go).toHaveBeenCalledWith(navAux.destinationPage);
        });

        it(`should throw error if exception thrown trying to call go method of history object`, () => {
            spyOn(history, 'go').and.throwError('unit-test-error');
            const navAux = new NavAux(-1);
            spyOn(console, 'error');
            expect(function () {
                NavigationService.goToState(navAux);
            }).toThrow();
        });
    });

    describe('#getRouterObj', () => {
        it('should return a router object', () => {
            const routerRes = NavigationService.getRouterObj();
            expect(routerRes).toBe(mockRouter);
        });
    });

    describe('#getLocationObj', () => {
        it('should return a location object', () => {
            const locationRes = NavigationService.getLocationObj();
            expect(locationRes).toBe(mockLocation);
        });
    });

    describe('#executeImperativeNavigation', () => {
        it('should call navigate method of Router object', () => {
           const navAux = new NavAux('aop-nav');
           NavigationService.executeImperativeNavigation(navAux);
           expect(mockRouter.navigate).toHaveBeenCalledWith([navAux.destinationPage], navAux.navigationExtra);
        });

        it('should throw error if exception thrown trying to call navigate method of router object', () => {
            const navAux = new NavAux('aop-nav');
            spyOn(console, 'error');
            mockRouter.navigate.and.throwError('unit-test-error');
            expect(function () {
                NavigationService.executeImperativeNavigation(navAux);
            }).toThrow();
         });
    });

    describe('#executePreProcessLogic', () => {
        it('should call passed in function argument', () => {
            const navAux = new NavAux('aop-page', undefined, mockFunction);
            spyOn(navAux, 'preprocess');
            NavigationService.executePreProcessLogic(navAux.preprocess, undefined);
            expect(navAux.preprocess).toHaveBeenCalled();
        });

        it('should call passed in function argument with the passed param argument', () => {
            const navAux = new NavAux('aop-page', undefined, mockFunction, 'aop-test');
            spyOn(navAux, 'preprocess');
            NavigationService.executePreProcessLogic(navAux.preprocess, navAux.param);
            expect(navAux.preprocess).toHaveBeenCalledWith(navAux.param);
        });

        it('should throw an error if an exception was thrown', () => {
            const navAux = new NavAux('aop-page', undefined, mockFunction, 'aop-test');
            spyOn(console, 'error');
            spyOn(navAux, 'preprocess').and.throwError('unit-test-error');
            expect(function () {
                NavigationService.executePreProcessLogic(navAux.preprocess, navAux.param);
            }).toThrow();
        });
    });
});

